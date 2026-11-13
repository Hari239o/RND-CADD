import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      // 1. Permanently remove all seeded dummy test students
      await db.collection('users').deleteMany({
        email: {
          $in: [
            'swamy.test@rndcadd.com',
            'priyanka.student@rndcadd.com',
            'rajesh.student@rndcadd.com',
            'swathi.student@rndcadd.com'
          ]
        }
      });

      // 2. Ensure student1@gmail.com exists cleanly for test signin without fake/dummy data
      const student1 = await db.collection('users').findOne({ email: 'student1@gmail.com' });
      if (!student1) {
        await db.collection('users').insertOne({
          name: 'Student 1',
          studentId: 'STU-001',
          email: 'student1@gmail.com',
          password: '9908',
          role: 'student',
          admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          courseName: 'Civil CADD & Master BIM',
          stream: 'Civil CADD & Master BIM',
          software: 'AutoCAD, Revit Architecture',
          qualification: '',
          college: '',
          residence: '',
          officialMobile: '',
          mobile: '',
          courseFee: 0,
          paidFee: 0,
          balanceFee: 0,
          accessStatus: 'active',
          assignedCourses: ['Civil CADD & Master BIM', 'Interior Architecture & 3D Visualization'],
          designs: [],
          createdAt: new Date()
        });
      } else {
        // Ensure student1 has both accredited assigned courses
        if (!Array.isArray(student1.assignedCourses) || student1.assignedCourses.length < 2) {
          await db.collection('users').updateOne(
            { email: 'student1@gmail.com' },
            {
              $set: {
                assignedCourses: ['Civil CADD & Master BIM', 'Interior Architecture & 3D Visualization']
              }
            }
          );
        }
        // Clean any residual dummy values from student1 if they were previously seeded
        if (student1.residence === 'KPHB Colony, Hyderabad' || student1.college === 'JNTU Hyderabad (College of Engg)' || student1.paidFee === 35000) {
          await db.collection('users').updateOne(
            { email: 'student1@gmail.com' },
            {
              $set: {
                name: 'Student 1',
                studentId: 'STU-001',
                qualification: '',
                college: '',
                officialMobile: '',
                mobile: '',
                residence: '',
                courseFee: 0,
                paidFee: 0,
                balanceFee: 0,
                designs: []
              }
            }
          );
        }
      }

      // Fetch all real student accounts (excluding admin)
      const users = await db
        .collection('users')
        .find({ role: { $ne: 'admin' } })
        .sort({ createdAt: -1 })
        .toArray();

      const formatted = users.map((u, i) => ({
        id: u._id.toString(),
        studentId: u.studentId || `STU-${String(i + 1).padStart(3, '0')}`,
        name: u.fullName || u.name || 'Enrolled Student',
        email: u.email,
        mobile: u.officialMobile && u.officialMobile !== '-' ? u.officialMobile : (u.mobile && u.mobile !== '-' ? u.mobile : (u.phone && u.phone !== '-' ? u.phone : '')),
        officialMobile: u.officialMobile && u.officialMobile !== '-' ? u.officialMobile : (u.mobile && u.mobile !== '-' ? u.mobile : (u.phone && u.phone !== '-' ? u.phone : '')),
        admissionDate: u.admissionDate || (u.createdAt
          ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })),
        courseName: u.courseName || u.stream || 'Civil CADD & Master BIM',
        software: u.software || 'AutoCAD, Revit',
        qualification: u.qualification || '-',
        college: u.college || '-',
        residence: u.residence || 'Hyderabad',
        courseFee: u.courseFee || 0,
        paidFee: u.paidFee !== undefined ? u.paidFee : 0,
        balanceFee: u.balanceFee !== undefined ? u.balanceFee : 0,
        accessStatus: u.accessStatus || 'active',
        assignedCourses: Array.isArray(u.assignedCourses) && u.assignedCourses.length > 0
          ? u.assignedCourses
          : [u.courseName || u.stream || 'Civil CADD & Master BIM'],
        designs: Array.isArray(u.designs) ? u.designs : [],
      }));

      return NextResponse.json({ success: true, students: formatted });
    }

    // Fallback if DB is disconnected
    return NextResponse.json({
      success: true,
      students: [
        {
          id: 'stu_001',
          studentId: 'STU-001',
          name: 'Student 1',
          email: 'student1@gmail.com',
          mobile: '',
          officialMobile: '',
          admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          courseName: 'Civil CADD & Master BIM',
          software: 'AutoCAD, Revit',
          qualification: '',
          college: '',
          residence: '',
          courseFee: 0,
          paidFee: 0,
          balanceFee: 0,
          accessStatus: 'active',
          assignedCourses: ['Civil CADD & Master BIM', 'Interior Architecture & 3D Visualization'],
          designs: [],
        }
      ]
    });
  } catch (error: any) {
    console.error('[Admin Students API Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, accessStatus, assignedCourses } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Student ID required' }, { status: 400 });
    }

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const updateData: any = { updatedAt: new Date() };
      if (accessStatus !== undefined) updateData.accessStatus = accessStatus;
      if (assignedCourses !== undefined) updateData.assignedCourses = assignedCourses;

      try {
        const { ObjectId } = await import('mongodb');
        await db.collection('users').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
      } catch {
        await db.collection('users').updateOne(
          { id },
          { $set: updateData }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Student access and courses updated successfully',
    });
  } catch (error: any) {
    console.error('[Admin Student Update Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      courseName,
      qualification,
      college,
      residence,
      mobile,
      courseFee,
      paidFee,
      assignedCourses
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Student name is required' }, { status: 400 });
    }

    const totalFee = Number(courseFee) || 0;
    const paid = Number(paidFee) || 0;
    const balance = Math.max(0, totalFee - paid);
    const studentId = `STU-${Math.floor(100 + Math.random() * 900)}`;
    const studentEmail = email && email.trim()
      ? email.trim()
      : `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(10 + Math.random() * 90)}@rndcadd.com`;

    const selectedCourse = courseName || 'Civil CADD & Master BIM';

    const newStudentData = {
      name: name.trim(),
      studentId,
      email: studentEmail,
      password: '9908',
      role: 'student',
      admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      stream: selectedCourse,
      courseName: selectedCourse,
      software: selectedCourse.includes('Civil') ? 'AutoCAD, Revit, 3ds Max' : 'SolidWorks, CATIA, ANSYS',
      qualification: qualification || '-',
      college: college || '-',
      residence: residence || 'Hyderabad',
      officialMobile: mobile || '-',
      mobile: mobile || '-',
      courseFee: totalFee,
      paidFee: paid,
      balanceFee: balance,
      accessStatus: 'active',
      assignedCourses: assignedCourses && assignedCourses.length > 0 ? assignedCourses : [selectedCourse],
      designs: [],
      createdAt: new Date()
    };

    const { db, isConnected } = await connectToDatabase();
    let insertedId = `local_${Date.now()}`;
    if (isConnected && db) {
      const res = await db.collection('users').insertOne(newStudentData);
      insertedId = res.insertedId.toString();
    }

    // Dispatch Admission Confirmation Email
    let emailDispatched = false;
    try {
      const { sendEmail } = await import('@/lib/email');
      const emailResult = await sendEmail({
        to: studentEmail,
        subject: `Admission Confirmation & Portal Access - RND CADD [${studentId}]`,
        text: `Dear ${name.trim()},

Welcome to RND CADD!

Your admission has been confirmed:
Student ID: ${studentId}
Course: ${selectedCourse}
Login Email: ${studentEmail}
Temporary Password: 9908

Student Portal: http://localhost:3000/portal/student

Fee Summary:
Total Fee: Rs. ${totalFee}
Paid Fee: Rs. ${paid}
Balance Due: Rs. ${balance}

Best regards,
RND CADD Training Institute`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #E2E8F0; border-radius: 16px; background-color: #FFFFFF;">
            <div style="border-bottom: 3px solid #EE2C3C; padding-bottom: 20px; margin-bottom: 24px;">
              <h2 style="color: #131313; margin: 0; font-size: 22px; font-weight: 800;">Admission Confirmation &amp; Portal Access</h2>
              <p style="color: #666666; margin: 6px 0 0 0; font-size: 14px;">RND CADD Training Institute &bull; Ameerpet Main Campus</p>
            </div>
            
            <p style="font-size: 16px; color: #131313; line-height: 24px; margin-bottom: 16px;">
              Dear <strong>${name.trim()}</strong>,
            </p>
            
            <p style="font-size: 15px; color: #334155; line-height: 24px;">
              Congratulations on your admission to <strong>RND CADD</strong>. Your student profile and lab workstation portal access have been activated. Below are your official enrollment credentials:
            </p>

            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; font-size: 14px; line-height: 22px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #64748B; width: 40%;">Student ID:</td>
                  <td style="font-weight: 700; font-family: monospace; color: #131313;">${studentId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Enrolled Course:</td>
                  <td style="font-weight: 700; color: #131313;">${selectedCourse}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Portal Login Email:</td>
                  <td style="font-weight: 700; color: #131313;">${studentEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Default Password:</td>
                  <td style="font-weight: 700; font-family: monospace; color: #EE2C3C;">9908</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">College / Institute:</td>
                  <td style="color: #131313;">${college || '-'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Total Course Fee:</td>
                  <td style="color: #131313;">Rs. ${totalFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Amount Paid:</td>
                  <td style="font-weight: 700; color: #16A34A;">Rs. ${paid.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748B;">Balance Due:</td>
                  <td style="font-weight: 700; color: ${balance > 0 ? '#E11D48' : '#64748B'};">Rs. ${balance.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="http://localhost:3000/portal/student" style="background-color: #EE2C3C; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block;">
                LOGIN TO STUDENT PORTAL &rarr;
              </a>
            </div>

            <p style="font-size: 13px; color: #64748B; line-height: 20px; border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 28px; text-align: center;">
              For any technical or lab support, contact our administration desk at <a href="mailto:support@rndcadd.com" style="color: #EE2C3C;">support@rndcadd.com</a> or call <strong>+91 99080 12345</strong>.
            </p>
          </div>
        `
      });
      emailDispatched = !!emailResult.success;
    } catch (mailError) {
      console.warn('[Admission Mail Warning]:', mailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Student registered successfully',
      emailDispatched,
      student: {
        id: insertedId,
        ...newStudentData
      }
    });
  } catch (error: any) {
    console.error('[Admin Student Creation Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Student ID required' }, { status: 400 });
    }

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      try {
        const { ObjectId } = await import('mongodb');
        await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      } catch {
        await db.collection('users').deleteOne({ id });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Student record deleted successfully',
    });
  } catch (error: any) {
    console.error('[Admin Student Delete Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
