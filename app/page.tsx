'use client';

import { useState, useEffect } from 'react';
import type { Course } from '@/lib/courses-data';
import { Header } from '@/components/Header';
import { UnloxHero } from '@/components/UnloxHero';
import { UpgradProgramsShowcase } from '@/components/UpgradProgramsShowcase';
import { DisciplineCourseHub } from '@/components/DisciplineCourseHub';
import { PartnerTicker } from '@/components/PartnerTicker';
import { PinnedHorizontalShowcase } from '@/components/PinnedHorizontalShowcase';
import { EnrollmentSection } from '@/components/EnrollmentSection';
import { CourseModal } from '@/components/CourseModal';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [activeStream, setActiveStream] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollCourseTitle, setEnrollCourseTitle] = useState<string>('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [studentStream, setStudentStream] = useState<string>('');

  useEffect(() => {
    const syncEnrolledData = () => {
      try {
        if (typeof window !== 'undefined') {
          const list: string[] = [];
          const userStr = localStorage.getItem('rnd_cadd_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'student') {
              if (user.stream) setStudentStream(user.stream);
              if (Array.isArray(user.assignedCourses)) {
                user.assignedCourses.forEach((c: string) => {
                  if (!list.includes(c)) list.push(c);
                });
              }
              if (user.email) {
                const userStored = localStorage.getItem(`rnd_cadd_enrolled_${user.email.toLowerCase()}`);
                if (userStored) {
                  try {
                    const parsed = JSON.parse(userStored);
                    if (Array.isArray(parsed)) {
                      parsed.forEach((c: string) => {
                        if (!list.includes(c)) list.push(c);
                      });
                    }
                  } catch {}
                }
              }
            }
          }
          setEnrolledCourses(list);
        }
      } catch {
        // ignore
      }
    };

    syncEnrolledData();
    window.addEventListener('storage', syncEnrolledData);
    window.addEventListener('focus', syncEnrolledData);
    return () => {
      window.removeEventListener('storage', syncEnrolledData);
      window.removeEventListener('focus', syncEnrolledData);
    };
  }, []);

  const handleEnrollSuccess = (courseTitle: string) => {
    if (!courseTitle) return;
    setEnrolledCourses((prev) => (prev.includes(courseTitle) ? prev : [...prev, courseTitle]));
    setTimeout(() => {
      const elem = document.getElementById('jobs-portal');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleSelectStream = (stream: string) => {
    setActiveStream(stream);
    const element = document.getElementById('revealed-courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenEnrollSection = (courseTitle?: string) => {
    if (courseTitle) {
      setEnrollCourseTitle(courseTitle);
    }
    const element = document.getElementById('enrollment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Fixed Technical Header */}
      <Header
        activeStream={activeStream}
        onSelectStream={handleSelectStream}
        onOpenEnrollModal={() => handleOpenEnrollSection()}
      />

      {/* Main Landing Experience */}
      <main>
        {/* Stage 1: Unlox Hero (Title Reveal & Welcome) */}
        <UnloxHero
          onSelectStream={(stream) => handleSelectStream(stream)}
          onExploreCatalog={() => handleSelectStream('all')}
        />

        {/* Stage 2: upGrad Programs Showcase (Exact Image 2: Vertical Folder Strips, Counter & Folder Courses) */}
        <UpgradProgramsShowcase
          activeStream={activeStream}
          onSelectStream={(stream) => setActiveStream(stream)}
          onOpenCourseModal={(course) => setSelectedCourse(course)}
        />

        {/* Stage 4: Revealed Course Catalog with Dedicated High-Res Course Imagery */}
        <DisciplineCourseHub
          activeStream={activeStream}
          onSelectStream={setActiveStream}
          onOpenCourseModal={(course) => setSelectedCourse(course)}
        />

        {/* Top Hiring EPC Partners Infinite Marquee */}
        <PartnerTicker />

        {/* Stage 5: Enterprise Training & Capstone Showcase (Pinned Horizontal Track) */}
        <PinnedHorizontalShowcase />

        {/* Stage 6: Admissions & Workstation Reservation (Students Enroll in Course) */}
        <EnrollmentSection
          preselectedCourse={enrollCourseTitle}
          onEnrollSuccess={handleEnrollSuccess}
        />
      </main>

      {/* Course Detail Interactive Modal */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={(title) => handleOpenEnrollSection(title)}
      />

      {/* Footer */}
      <Footer
        onSelectStream={handleSelectStream}
        onOpenEnrollModal={() => handleOpenEnrollSection()}
      />
    </div>
  );
}
