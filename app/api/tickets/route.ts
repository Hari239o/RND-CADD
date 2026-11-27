import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  category:
    | 'Software & License'
    | 'Lab Workstation & Hardware'
    | 'Coursework & Project Doubts'
    | 'Certificate & Credential'
    | 'Placement & Career'
    | 'General Query';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  adminReply?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback cache for instant response if MongoDB is offline
let inMemoryTickets: SupportTicket[] = [];

// Helper to seed DB if empty
async function ensureDbSeeded(db: any) {
  try {
    await db.collection('tickets').deleteMany({
      $or: [
        { id: { $in: ['tkt-init-1', 'tkt-init-2', 'tkt-init-3'] } },
        { ticketNumber: { $in: ['TKT-2026-8492', 'TKT-2026-8493', 'TKT-2026-8501'] } }
      ]
    });
  } catch (err) {
    console.error('Failed to clean tickets collection:', err);
  }
}

// GET: Retrieve tickets (all for admin, or filtered by studentId or email)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  try {
    const { db, isConnected } = await connectToDatabase();

    if (isConnected && db) {
      await ensureDbSeeded(db);

      const query: any = {};
      if (id) {
        query.id = id;
      } else if (studentId || email) {
        const conditions: any[] = [];
        if (studentId) conditions.push({ studentId: { $regex: new RegExp(`^${studentId}$`, 'i') } });
        if (email) conditions.push({ studentEmail: { $regex: new RegExp(`^${email}$`, 'i') } });
        query.$or = conditions;
      }

      const tickets = await db
        .collection('tickets')
        .find(query)
        .sort({ updatedAt: -1, createdAt: -1 })
        .toArray();

      return NextResponse.json({
        success: true,
        tickets: tickets.map((t: any) => {
          const { _id, ...rest } = t;
          return rest;
        }),
      });
    }

    // In-memory fallback
    let results = [...inMemoryTickets];
    if (id) {
      results = results.filter((t) => t.id === id);
    } else if (studentId || email) {
      results = results.filter((t) => {
        const matchId = studentId && t.studentId.toLowerCase() === studentId.toLowerCase();
        const matchEmail = email && t.studentEmail.toLowerCase() === email.toLowerCase();
        return matchId || matchEmail;
      });
    }

    results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      tickets: results,
    });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tickets', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Student raises a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentEmail,
      course,
      category,
      priority,
      subject,
      description,
    } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { success: false, message: 'Subject and problem description are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}-${randomSuffix}`,
      ticketNumber: `TKT-${new Date().getFullYear()}-${randomSuffix}`,
      studentId: studentId || 'STU-GEN-001',
      studentName: studentName || 'Student',
      studentEmail: studentEmail || 'student@rndcadd.com',
      course: course || 'General Engineering CADD',
      category: category || 'Coursework & Project Doubts',
      priority: priority || 'Medium',
      subject: subject.trim(),
      description: description.trim(),
      status: 'Open',
      createdAt: now,
      updatedAt: now,
    };

    // Save to in-memory fallback
    inMemoryTickets.unshift(newTicket);

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('tickets').insertOne({ ...newTicket });
    }

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: 'Support ticket raised successfully. Admin team will review and respond promptly.',
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to raise ticket', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Admin solves / replies to a ticket or updates status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminReply, resolvedBy } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updateFields: any = {
      updatedAt: now,
    };

    if (status) updateFields.status = status;
    if (adminReply !== undefined) updateFields.adminReply = adminReply;
    if (resolvedBy) updateFields.resolvedBy = resolvedBy;
    if (status === 'Resolved') {
      updateFields.resolvedAt = now;
      if (!resolvedBy) {
        updateFields.resolvedBy = 'CAD Faculty Desk';
      }
    }

    // Update in-memory fallback
    const idx = inMemoryTickets.findIndex((t) => t.id === id);
    if (idx !== -1) {
      inMemoryTickets[idx] = {
        ...inMemoryTickets[idx],
        ...updateFields,
      };
    }

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('tickets').updateOne({ id }, { $set: updateFields });
    }

    const updated = inMemoryTickets.find((t) => t.id === id);

    return NextResponse.json({
      success: true,
      ticket: updated,
      message: 'Ticket updated and resolution response saved successfully.',
    });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update ticket', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove ticket
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Ticket ID required' }, { status: 400 });
    }

    inMemoryTickets = inMemoryTickets.filter((t) => t.id !== id);

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('tickets').deleteOne({ id });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete ticket', error: error.message },
      { status: 500 }
    );
  }
}
