import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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

// In-memory fallback cache
let currentLiveSession: LiveClassSession | null = {
  id: 'live-default-1',
  title: 'Parametric Family Creation & Advanced Modeling in Autodesk Revit',
  trainer: 'Er. Swamy Naidu',
  course: 'Civil CADD & Master BIM',
  status: 'Live Now',
  isLive: true,
  streamUrl: 'https://meet.google.com/new',
  platform: 'Virtual CAD Workstation',
  timing: 'Live Broadcast Active (Lab Session)',
  description: 'Trainer Er. Swamy Naidu is currently live demonstrating Parametric Family Creation in Autodesk Revit. Connect to your dedicated CAD workstation screen.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let sessionHistory: LiveClassSession[] = [];

// GET: Retrieve the active live class session and history
export async function GET() {
  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('live_classes');
      const active = await collection.findOne({ status: 'Live Now' }, { sort: { updatedAt: -1 } });
      const latest = active || (await collection.findOne({}, { sort: { updatedAt: -1 } }));
      const historyDocs = await collection.find({}).sort({ updatedAt: -1 }).limit(10).toArray();

      const formatSession = (doc: any): LiveClassSession => ({
        id: doc.id || doc._id?.toString() || `live-${Date.now()}`,
        title: doc.title || 'Parametric Family Creation in Autodesk Revit',
        trainer: doc.trainer || 'Er. Swamy Naidu',
        course: doc.course || 'All Enrolled Students',
        status: doc.status || 'Live Now',
        isLive: doc.status === 'Live Now' || Boolean(doc.isLive),
        streamUrl: doc.streamUrl || 'https://meet.google.com/new',
        platform: doc.platform || 'Virtual CAD Workstation',
        timing: doc.timing || 'Live Broadcast Active',
        description: doc.description || '',
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString(),
      });

      const current = latest ? formatSession(latest) : currentLiveSession;
      const history = historyDocs.map(formatSession);

      return NextResponse.json({
        success: true,
        liveClass: current,
        history,
      });
    }
  } catch (err) {
    console.warn('[Live Classes API] Database retrieval notice, serving local memory cache:', err);
  }

  // Fallback if DB is disconnected
  return NextResponse.json({
    success: true,
    liveClass: currentLiveSession,
    history: sessionHistory,
  });
}

// POST: Broadcast / Update Live Class
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
      status === 'Scheduled' || status === 'Ended' ? status : 'Live Now';

    const newSession: LiveClassSession = {
      id: body.id || `live-${Date.now()}`,
      title: title.trim(),
      trainer: trainer?.trim() || 'Er. Swamy Naidu',
      course: course?.trim() || 'All Enrolled Students',
      status: sessionStatus,
      isLive: sessionStatus === 'Live Now',
      streamUrl: streamUrl?.trim() || 'https://meet.google.com/new',
      platform: platform || 'Virtual CAD Workstation',
      timing: timing?.trim() || (sessionStatus === 'Live Now' ? 'Live Streaming Now' : 'Scheduled Session'),
      description: description?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    currentLiveSession = newSession;
    sessionHistory.unshift(newSession);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('live_classes');
        // If this is set to Live Now, end any other active sessions
        if (sessionStatus === 'Live Now') {
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
      message: sessionStatus === 'Live Now' ? 'Live class broadcasted to student portal!' : 'Live class details saved!',
      liveClass: newSession,
    });
  } catch (error: any) {
    console.error('[Live Classes POST Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Toggle Live status (e.g. End Live Class or Go Live)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, id } = body;

    const newStatus: 'Live Now' | 'Scheduled' | 'Ended' =
      status === 'Live Now' || status === 'Scheduled' || status === 'Ended' ? status : 'Ended';

    if (currentLiveSession) {
      currentLiveSession = {
        ...currentLiveSession,
        status: newStatus,
        isLive: newStatus === 'Live Now',
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('live_classes');
        if (id) {
          await collection.updateOne(
            { $or: [{ id }, { _id: id }] },
            { $set: { status: newStatus, isLive: newStatus === 'Live Now', updatedAt: new Date().toISOString() } }
          );
        } else {
          await collection.updateMany(
            {},
            { $set: { status: newStatus, isLive: newStatus === 'Live Now', updatedAt: new Date().toISOString() } }
          );
        }
      }
    } catch (dbErr) {
      console.warn('[Live Classes API] Database status update fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Live class status updated to ${newStatus}`,
      liveClass: currentLiveSession,
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

    if (currentLiveSession && (!id || currentLiveSession.id === id)) {
      currentLiveSession = {
        ...currentLiveSession,
        status: 'Ended',
        isLive: false,
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('live_classes');
        if (id) {
          await collection.deleteOne({ $or: [{ id }, { _id: id }] });
        } else {
          await collection.updateMany(
            { status: 'Live Now' },
            { $set: { status: 'Ended', isLive: false, updatedAt: new Date().toISOString() } }
          );
        }
      }
    } catch (dbErr) {
      console.warn('[Live Classes API] Database delete fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Live session ended.',
    });
  } catch (error: any) {
    console.error('[Live Classes DELETE Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
