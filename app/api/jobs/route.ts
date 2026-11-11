import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { JobPost, JobNotification, INITIAL_JOBS, INITIAL_NOTIFICATIONS } from '@/lib/jobs-data';
import { getStoredJobsData, saveStoredJobsData } from '@/lib/jobs-storage';

export const dynamic = 'force-dynamic';

// GET all jobs, notifications, and placement metrics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discipline = searchParams.get('discipline');
    const status = searchParams.get('status');

    let { jobs, notifications } = getStoredJobsData();

    // Check if live MongoDB has updated data
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const jobsCollection = db.collection('jobs');
        let dbJobs = await jobsCollection.find({}).sort({ postedDate: -1 }).toArray();

        // Ensure baseline verified openings always exist in MongoDB
        const existingIds = new Set(dbJobs.map((j: any) => j.id));
        const missingInitial = INITIAL_JOBS.filter((j) => !existingIds.has(j.id));
        if (missingInitial.length > 0) {
          try {
            await jobsCollection.insertMany(missingInitial.map((j) => ({ ...j })));
            dbJobs = await jobsCollection.find({}).sort({ postedDate: -1 }).toArray();
          } catch {
            // ignore
          }
        }

        if (dbJobs.length > 0) {
          jobs = dbJobs.map((j: any) => ({
            id: j.id || j._id?.toString(),
            title: j.title,
            company: j.company,
            companyLogo: j.companyLogo,
            discipline: j.discipline,
            jobType: j.jobType || 'Full-Time',
            workMode: j.workMode || 'On-site',
            location: j.location,
            salary: j.salary,
            experience: j.experience,
            vacancies: Number(j.vacancies) || 1,
            tools: j.tools || [],
            description: j.description || '',
            requirements: j.requirements || [],
            postedDate: j.postedDate || new Date().toISOString().split('T')[0],
            deadline: j.deadline,
            status: j.status || 'Active',
            isFeatured: Boolean(j.isFeatured),
            applicantsCount: Array.isArray(j.applicants) ? j.applicants.length : (j.applicantsCount || 0),
            applicants: j.applicants || [],
          }));
        }

        const notifCollection = db.collection('job_notifications');
        let dbNotifs = await notifCollection.find({}).sort({ timestamp: -1 }).limit(20).toArray();

        const existingNotifIds = new Set(dbNotifs.map((n: any) => n.id));
        const missingNotifs = INITIAL_NOTIFICATIONS.filter((n) => !existingNotifIds.has(n.id));
        if (missingNotifs.length > 0) {
          try {
            await notifCollection.insertMany(missingNotifs.map((n) => ({ ...n })));
            dbNotifs = await notifCollection.find({}).sort({ timestamp: -1 }).limit(20).toArray();
          } catch {
            // ignore
          }
        }

        if (dbNotifs.length > 0) {
          notifications = dbNotifs.map((n: any) => ({
            id: n.id || n._id?.toString(),
            jobId: n.jobId,
            title: n.title,
            company: n.company,
            discipline: n.discipline,
            message: n.message,
            timestamp: n.timestamp,
            isRead: Boolean(n.isRead),
          }));
        }
      }
    } catch (dbErr) {
      console.warn('[Jobs API] MongoDB retrieval fallback:', dbErr);
    }

    // Filter if requested
    let filteredJobs = [...jobs];
    if (discipline && discipline.toLowerCase() !== 'all') {
      filteredJobs = filteredJobs.filter(
        (j) => j.discipline.toLowerCase() === discipline.toLowerCase() || j.discipline === 'all'
      );
    }
    if (status) {
      filteredJobs = filteredJobs.filter(
        (j) => j.status.toLowerCase() === status.toLowerCase()
      );
    }

    const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
    const activeJobs = jobs.filter((j) => j.status === 'Active').length;

    return NextResponse.json({
      success: true,
      jobs: filteredJobs,
      allJobs: jobs,
      notifications,
      stats: {
        totalJobs: jobs.length,
        activeJobs,
        totalApplicants,
      },
    });
  } catch (error) {
    console.error('[Jobs API] GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST: Admin publishes a new job vacancy & dispatches student notification
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.company) {
      return NextResponse.json(
        { success: false, message: 'Job title and company name are required' },
        { status: 400 }
      );
    }

    const currentData = getStoredJobsData();
    const jobId = body.id || `JOB-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    const newJob: JobPost = {
      id: jobId,
      title: body.title.trim(),
      company: body.company.trim(),
      companyLogo: body.companyLogo || '',
      discipline: (body.discipline || 'civil').toLowerCase() as any,
      jobType: body.jobType || 'Full-Time',
      workMode: body.workMode || 'On-site',
      location: body.location || 'Hyderabad, Telangana',
      salary: body.salary || '₹5.0 - ₹7.5 LPA',
      experience: body.experience || '0-2 Years',
      vacancies: Number(body.vacancies) || 1,
      tools: Array.isArray(body.tools) ? body.tools : (body.tools ? String(body.tools).split(',').map((s: string) => s.trim()) : ['CAD Tools']),
      description: body.description || 'Exciting engineering vacancy for certified trainees.',
      requirements: Array.isArray(body.requirements) ? body.requirements : (body.requirements ? String(body.requirements).split('\n').map((s: string) => s.trim()).filter(Boolean) : ['Certification in relevant CAD/BIM tools']),
      postedDate: body.postedDate || today,
      deadline: body.deadline || '',
      status: (body.status || 'Active') as 'Active' | 'Closed',
      isFeatured: Boolean(body.isFeatured),
      applicantsCount: 0,
      applicants: [],
    };

    // Generate automatic real-time student notification
    const newNotification: JobNotification = {
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      jobId: newJob.id,
      title: `New Placement Drive: ${newJob.company}`,
      company: newJob.company,
      discipline: newJob.discipline,
      message: `${newJob.company} is hiring for "${newJob.title}" (${newJob.salary}). Trainees in ${newJob.discipline.toUpperCase()} stream can apply now!`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Persist to file
    currentData.jobs = [newJob, ...currentData.jobs.filter((j) => j.id !== newJob.id)];
    currentData.notifications = [newNotification, ...currentData.notifications];
    saveStoredJobsData(currentData);

    // Persist to MongoDB if active
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('jobs').insertOne(newJob);
        await db.collection('job_notifications').insertOne(newNotification);
      }
    } catch (dbErr) {
      console.warn('[Jobs API] MongoDB insert fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      job: newJob,
      notification: newNotification,
      message: 'Job published successfully and notification dispatched to students!',
    });
  } catch (error) {
    console.error('[Jobs API] POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not create job vacancy' },
      { status: 500 }
    );
  }
}

// PUT: Admin updates job details or status (Active / Closed)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const jobId = body.id;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    const currentData = getStoredJobsData();
    const existingIndex = currentData.jobs.findIndex((j) => j.id === jobId);

    if (existingIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    const updatedJob: JobPost = {
      ...currentData.jobs[existingIndex],
      ...body,
      id: jobId,
    };

    currentData.jobs[existingIndex] = updatedJob;
    saveStoredJobsData(currentData);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('jobs').findOneAndUpdate(
          { id: jobId },
          { $set: updatedJob },
          { returnDocument: 'after', upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn('[Jobs API] MongoDB update fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: 'Job vacancy updated successfully',
    });
  } catch (error) {
    console.error('[Jobs API] PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not update job vacancy' },
      { status: 500 }
    );
  }
}

// DELETE: Admin removes a job
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }

    const currentData = getStoredJobsData();
    currentData.jobs = currentData.jobs.filter((j) => j.id !== jobId);
    currentData.notifications = currentData.notifications.filter((n) => n.jobId !== jobId);
    saveStoredJobsData(currentData);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('jobs').deleteOne({ id: jobId });
        await db.collection('job_notifications').deleteMany({ jobId });
      }
    } catch (dbErr) {
      console.warn('[Jobs API] MongoDB delete fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Job vacancy deleted successfully',
    });
  } catch (error) {
    console.error('[Jobs API] DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not delete job vacancy' },
      { status: 500 }
    );
  }
}
