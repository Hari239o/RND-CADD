import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { JobApplicant } from '@/lib/jobs-data';
import { getStoredJobsData, saveStoredJobsData } from '@/lib/jobs-storage';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      jobId,
      name,
      email,
      phone,
      stream,
      studentId,
      qualification,
      portfolioUrl,
      coverNote,
    } = body;

    if (!jobId || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Job ID, name, email, and phone number are required' },
        { status: 400 }
      );
    }

    const currentData = getStoredJobsData();
    const jobIndex = currentData.jobs.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Target job vacancy not found' },
        { status: 404 }
      );
    }

    const newApplicant: JobApplicant = {
      id: `APP-${Date.now().toString().slice(-6)}`,
      jobId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      stream: stream || currentData.jobs[jobIndex].discipline,
      studentId: studentId?.trim() || 'CADD-ALUMNI',
      qualification: qualification?.trim() || 'Diploma / B.Tech Engineering',
      portfolioUrl: portfolioUrl?.trim() || '',
      coverNote: coverNote?.trim() || '',
      appliedAt: new Date().toISOString(),
      status: 'Under Review',
    };

    // Update applicants list on the job
    const job = currentData.jobs[jobIndex];
    if (!Array.isArray(job.applicants)) {
      job.applicants = [];
    }

    // Check if duplicate application
    const existingApp = job.applicants.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (existingApp) {
      return NextResponse.json(
        { success: true, message: 'Application already on file for this opening.', applicant: existingApp }
      );
    }

    job.applicants = [newApplicant, ...job.applicants];
    job.applicantsCount = job.applicants.length;
    currentData.jobs[jobIndex] = job;
    saveStoredJobsData(currentData);

    // Persist to MongoDB if available
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('jobs').updateOne(
          { id: jobId },
          {
            $push: { applicants: newApplicant as any },
            $inc: { applicantsCount: 1 },
          }
        );
        await db.collection('job_applications').insertOne(newApplicant);
      }
    } catch (dbErr) {
      console.warn('[Jobs Apply API] MongoDB update fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Application submitted successfully for ${job.title} at ${job.company}!`,
      applicant: newApplicant,
    });
  } catch (error) {
    console.error('[Jobs Apply API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
