'use client';

import { useState, useEffect } from 'react';
import type { Course } from '@/lib/courses-data';
import { Header } from '@/components/Header';
import { RndCaddHero } from '@/components/RndCaddHero';
import { UpgradProgramsShowcase } from '@/components/UpgradProgramsShowcase';
import { DisciplineCourseHub } from '@/components/DisciplineCourseHub';
import { PartnerTicker } from '@/components/PartnerTicker';
import { EnrollmentSection } from '@/components/EnrollmentSection';
import { CourseModal } from '@/components/CourseModal';
import { EnquiryModal, FloatingEnquiryButton } from '@/components/EnquiryModal';
import { ScrollToTopProgress } from '@/components/ScrollToTopProgress';
import { Footer } from '@/components/Footer';
import { RazorpayCheckoutModal } from '@/components/RazorpayCheckoutModal';
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/site-content';

export default function HomePage() {
  const [activeStream, setActiveStream] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollCourseTitle, setEnrollCourseTitle] = useState<string>('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [studentStream, setStudentStream] = useState<string>('');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryInitialCourse, setEnquiryInitialCourse] = useState<string>('');
  const [razorpayCourse, setRazorpayCourse] = useState<any | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  // Fetch live dynamic site content
  useEffect(() => {
    // 1. Instant cache from localStorage
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('rnd_cadd_site_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            setSiteContent((prev) => ({ ...prev, ...parsed }));
          }
        }
      }
    } catch {}

    // 2. Fetch fresh from server API
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/site-content');
        const data = await res.json();
        if (data.success && data.content) {
          setSiteContent(data.content);
          if (typeof window !== 'undefined') {
            localStorage.setItem('rnd_cadd_site_content', JSON.stringify(data.content));
          }
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
      }
    };

    fetchContent();

    const handleContentUpdate = (e: any) => {
      if (e.detail?.content) {
        setSiteContent(e.detail.content);
      } else {
        fetchContent();
      }
    };

    window.addEventListener('rnd_cadd_site_content_updated', handleContentUpdate);
    window.addEventListener('storage', handleContentUpdate);

    return () => {
      window.removeEventListener('rnd_cadd_site_content_updated', handleContentUpdate);
      window.removeEventListener('storage', handleContentUpdate);
    };
  }, []);

  useEffect(() => {
    const handleGlobalOpenEnquiry = (e: any) => {
      if (e.detail?.courseTitle) {
        setEnquiryInitialCourse(e.detail.courseTitle);
      }
      setIsEnquiryModalOpen(true);
    };

    window.addEventListener('open-enquiry-modal', handleGlobalOpenEnquiry);
    return () => {
      window.removeEventListener('open-enquiry-modal', handleGlobalOpenEnquiry);
    };
  }, []);

  useEffect(() => {
    const syncEnrolledData = () => {
      try {
        if (typeof window !== 'undefined') {
          const list: string[] = [];
          const userStr = sessionStorage.getItem('rnd_cadd_user') || localStorage.getItem('rnd_cadd_user');
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

  // Listen for global Razorpay checkout requests from course cards
  useEffect(() => {
    const handleOpenRazorpay = (e: any) => {
      if (e.detail?.course) {
        setRazorpayCourse(e.detail.course);
      }
    };
    window.addEventListener('rnd_cadd_open_razorpay', handleOpenRazorpay);
    return () => window.removeEventListener('rnd_cadd_open_razorpay', handleOpenRazorpay);
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
        {/* Stage 1: Official Hero (Title Reveal & Welcome) */}
        <RndCaddHero
          content={siteContent.hero}
          onSelectStream={(stream) => handleSelectStream(stream)}
          onExploreCatalog={() => handleSelectStream('all')}
        />

        {/* Stage 2: upGrad Programs Showcase (Exact Image 2: Vertical Folder Strips, Counter & Folder Courses) */}
        <UpgradProgramsShowcase
          content={siteContent.programs}
          activeStream={activeStream}
          onSelectStream={(stream) => setActiveStream(stream)}
          onOpenCourseModal={(course) => setSelectedCourse(course)}
        />

        {/* Stage 4: Revealed Course Catalog with Dedicated High-Res Course Imagery */}
        <DisciplineCourseHub
          content={siteContent.catalog}
          activeStream={activeStream}
          onSelectStream={setActiveStream}
          onOpenCourseModal={(course) => setSelectedCourse(course)}
          onEnroll={(course) => handleOpenEnrollSection(course.title)}
        />

        {/* Top Hiring EPC Partners Infinite Marquee */}
        <PartnerTicker content={siteContent.partners} />

        {/* Stage 6: Admissions & Workstation Reservation (Students Enroll in Course) */}
        <EnrollmentSection
          content={siteContent.enrollment}
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

      {/* Floating Right-edge "Enquiry Now" Vertical Button (Hidden when CourseModal is open to prevent duplicate overlay) */}
      {!selectedCourse && (
        <FloatingEnquiryButton onOpen={() => setIsEnquiryModalOpen(true)} />
      )}

      {/* Global Interactive Enquiry Modal matching exact user screenshot */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          setEnquiryInitialCourse('');
        }}
        initialCourseTitle={enquiryInitialCourse}
      />

      {/* Dynamic Circular Progress Scroll-To-Top Button (Hidden when CourseModal is open to prevent double button glitch) */}
      {!selectedCourse && <ScrollToTopProgress threshold={300} />}

      {/* Global Razorpay Course Enrollment Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={!!razorpayCourse}
        onClose={() => setRazorpayCourse(null)}
        course={razorpayCourse}
      />

      {/* Footer */}
      <Footer
        content={siteContent.footer}
        onSelectStream={handleSelectStream}
        onOpenEnrollModal={() => setIsEnquiryModalOpen(true)}
      />
    </div>
  );
}
