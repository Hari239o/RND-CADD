import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

export interface LiveClassSession {
  id: string;
  title: string;
  trainer: string;
  course: string;
  status: 'Live Now' | 'Scheduled' | 'Ended';
  isLive: boolean;
  streamUrl: string;
  platform: 'Virtual CAD Workstation' | 'Google Meet' | 'Zoom' | 'YouTube Live' | 'Microsoft Teams';
  timing: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_OFFLINE_SESSION: LiveClassSession = {
  id: 'live-default-1',
  title: 'Parametric Family Creation & Advanced Modeling in Autodesk Revit',
  trainer: 'Er. Swamy Naidu',
  course: 'Civil CADD & Master BIM',
  status: 'Ended',
  isLive: false,
  streamUrl: 'https://meet.google.com/new',
  platform: 'Virtual CAD Workstation',
  timing: 'Batch Schedule: Mon-Fri 10:00 AM',
  description: 'Trainer Er. Swamy Naidu demonstrates Parametric Family Creation in Autodesk Revit.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// File paths for resilient serverless cross-instance persistence
const TMP_FILE = path.join(os.tmpdir(), 'rnd_cadd_live_session.json');
const SCRATCH_FILE = path.join(process.cwd(), 'scratch', 'live_session.json');

function readPersistentSession(): { current: LiveClassSession; history: LiveClassSession[] } {
  for (const filePath of [TMP_FILE, SCRATCH_FILE]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.current) {
          return {
            current: parsed.current,
            history: Array.isArray(parsed.history) ? parsed.history : [parsed.current],
          };
        }
      }
    } catch {
      // Continue to next file
    }
  }
  return { current: DEFAULT_OFFLINE_SESSION, history: [DEFAULT_OFFLINE_SESSION] };
}

function writePersistentSession(current: LiveClassSession, history: LiveClassSession[]): void {
  const data = JSON.stringify({ current, history }, null, 2);
  for (const filePath of [TMP_FILE, SCRATCH_FILE]) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, data, 'utf-8');
    } catch {
      // ignore
    }
  }
}

// In-memory runtime cache
let memorySession: LiveClassSession = readPersistentSession().current;
let memoryHistory: LiveClassSession[] = readPersistentSession().history;

// GET: Retrieve the active live class session and history
export async function GET() {
  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('live_classes');
      
      // Look for currently active live session first
      const activeDoc = await collection.findOne({ status: 'Live Now', isLive: true }, { sort: { updatedAt: -1 } });
      const latestDoc = activeDoc || (await collection.findOne({}, { sort: { updatedAt: -1 } }));
      const historyDocs = await collection.find({}).sort({ updatedAt: -1 }).limit(20).toArray();

      const formatSession = (doc: any): LiveClassSession => ({
        id: doc.id || doc._id?.toString() || `live-${Date.now()}`,
        title: doc.title || 'Parametric Family Creation in Autodesk Revit',
        trainer: doc.trainer || 'Er. Swamy Naidu',
        course: doc.course || 'All Enrolled Students',
        status: doc.status === 'Live Now' ? 'Live Now' : (doc.status === 'Scheduled' ? 'Scheduled' : 'Ended'),
        isLive: doc.status === 'Live Now' && Boolean(doc.isLive !== false),
        streamUrl: doc.streamUrl || 'https://meet.google.com/new',
        platform: doc.platform || 'Virtual CAD Workstation',
        timing: doc.timing || (doc.status === 'Live Now' ? 'Live Streaming Now' : 'Batch Lab Session'),
        description: doc.description || '',
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString(),
      });

      if (latestDoc) {
        const current = formatSession(latestDoc);
        const history = historyDocs.length > 0 ? historyDocs.map(formatSession) : [current];
        memorySession = current;
        memoryHistory = history;
        writePersistentSession(current, history);
        return NextResponse.json({ success: true, liveClass: current, history });
      }
    }
  } catch (err) {
    console.warn('[Live Classes API] Database notice, checking file persistence:', err);
  }

  // Fallback to cross-container file persistence & runtime memory
  const persistent = readPersistentSession();
  memorySession = persistent.current;
  memoryHistory = persistent.history;

  return NextResponse.json({
    success: true,
    liveClass: memorySession,
    history: memoryHistory,
  });
}

// POST: Broadcast / Update / Create Live Class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      trainer,
      course,
      status,
      streamUrl,
      platform,
      timing,
      description,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: 'Session title is required.' }, { status: 400 });
    }

    const sessionStatus: 'Live Now' | 'Scheduled' | 'Ended' =
      status === 'Scheduled' ? 'Scheduled' : (status === 'Ended' ? 'Ended' : 'Live Now');
    const isLive = sessionStatus === 'Live Now';

    const newSession: LiveClassSession = {
      id: body.id || `live-${Date.now()}`,
      title: title.trim(),
      trainer: trainer?.trim() || 'Er. Swamy Naidu',
      course: course?.trim() || 'All Enrolled Students',
      status: sessionStatus,
      isLive,
      streamUrl: streamUrl?.trim() || 'https://meet.google.com/new',
      platform: platform || 'Virtual CAD Workstation',
      timing: timing?.trim() || (isLive ? 'Live Streaming Now' : (sessionStatus === 'Scheduled' ? 'Scheduled Upcoming' : 'Ended')),
      description: description?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update runtime memory & disk persistence
    memorySession = newSession;
    memoryHistory = [newSession, ...memoryHistory.filter((h) => h.id !== newSession.id)].slice(0, 20);
    writePersistentSession(newSession, memoryHistory);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('live_classes');
        // If this is set to Live Now, end any existing active live sessions
        if (isLive) {
          await collection.updateMany(
            { status: 'Live Now' },
            { $set: { status: 'Ended', isLive: false, updatedAt: new Date().toISOString() } }
          );
        }
        await collection.insertOne({ ...newSession });
      }
    } catch (dbErr) {
      console.warn('[Live Classes API] Database persist fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: isLive ? 'Live class broadcast is active on Student Portal!' : (sessionStatus === 'Scheduled' ? 'Class scheduled successfully!' : 'Session marked as ended.'),
      liveClass: newSession,
      history: memoryHistory,
    });
  } catch (error: any) {
    console.error('[Live Classes POST Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Toggle / End Live Class Status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, id } = body;

    const newStatus: 'Live Now' | 'Scheduled' | 'Ended' =
      status === 'Live Now' ? 'Live Now' : (status === 'Scheduled' ? 'Scheduled' : 'Ended');
    const isLive = newStatus === 'Live Now';

    const current = readPersistentSession().current;
    const updatedSession: LiveClassSession = {
      ...current,
      ...(id ? { id } : {}),
      status: newStatus,
      isLive,
      timing: isLive ? 'Live Streaming Now' : (newStatus === 'Scheduled' ? current.timing : 'Broadcast Ended'),
      updatedAt: new Date().toISOString(),
    };

    memorySession = updatedSession;
    memoryHistory = [updatedSession, ...memoryHistory.filter((h) => h.id !== updatedSession.id)].slice(0, 20);
    writePersistentSession(updatedSession, memoryHistory);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('live_classes');
        if (id) {
          await collection.updateOne(
            { $or: [{ id }, { _id: id }] },
            { $set: { status: newStatus, isLive, updatedAt: new Date().toISOString() } }
          );
        } else {
          // If no id, update all currently live sessions to Ended
          await collection.updateMany(
            {},
            { $set: { status: newStatus, isLive, updatedAt: new Date().toISOString() } }
          );
        }
      }
    } catch (dbErr) {
      console.warn('[Live Classes API] Database status update notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: isLive ? 'Live stream is now ACTIVE!' : 'Live stream has been ENDED. Students screen now offline.',
      liveClass: updatedSession,
      history: memoryHistory,
    });
  } catch (error: any) {
    console.error('[Live Classes PATCH Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Remove live class session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const updatedSession: LiveClassSession = {
      ...DEFAULT_OFFLINE_SESSION,
      status: 'Ended',
      isLive: false,
      updatedAt: new Date().toISOString(),
    };

    memorySession = updatedSession;
    memoryHistory = memoryHistory.filter((h) => h.id !== id);
    writePersistentSession(updatedSession, memoryHistory);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('live_classes');
        if (id) {
          await collection.deleteOne({ $or: [{ id }, { _id: id }] });
        } else {
          await collection.deleteMany({});
        }
      }
    } catch (dbErr) {
      console.warn('[Live Classes API] Database delete notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Live session deleted and marked ended.',
      liveClass: updatedSession,
      history: memoryHistory,
    });
  } catch (error: any) {
    console.error('[Live Classes DELETE Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
