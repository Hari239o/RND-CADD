'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';

interface OurProgramsGridProps {
  onOpenCourseModal: (course: Course) => void;
  onExploreMore: () => void;
}

export const OurProgramsGrid: React.FC<OurProgramsGridProps> = ({
  onOpenCourseModal,
  onExploreMore,
}) => {
  const programs = [
    {
      id: 'mech-cadd',
      title: 'Mechanical CADD',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description:
        'Mechanical CAD courses in RND CADD Ameerpet are typically designed to teach individuals how to use CAD software to create 2D and 3D models of mechanical parts and assemblies.',
      targetCourseId: 'mech-solidworks-prof',
    },
    {
      id: 'civil-cadd',
      title: 'Civil CADD',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      description:
        'Civil CAD courses typically cover topics related to computer-aided design (CAD) software as it applies to civil engineering projects.',
      targetCourseId: 'civil-autocad-adv',
    },
    {
      id: 'bim-architecture',
      title: 'Building Information Modelling (BIM)',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      description:
        'Learn industry-leading BIM software for architectural, structural, and MEP design. Gain hands-on experience with AutoCAD, Revit, Navisworks, and Enscape through practical projects and expert training.',
      targetCourseId: 'civil-revit-bim',
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      description:
        'Interior design courses are a great way to learn about the principles and techniques of designing interior spaces. These courses typically cover topics such as space planning, color theory, furniture design, and interior architecture.',
      targetCourseId: 'civil-3dsmax-vray',
    },
    {
      id: 'electrical-cadd',
      title: 'Electrical CADD',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      description:
        'Electrical courses cover a wide range of topics related to electrical engineering and technology. These courses typically include subjects such as circuit theory, electronics, power systems, digital systems, control systems, and telecommunications.',
      targetCourseId: 'eee-autocad-elec',
    },
    {
      id: 'project-management',
      title: 'Project Management',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      description:
        'Develop project planning, scheduling, and management skills using industry-standard tools like AutoCAD, Primavera, and Microsoft Project through practical, hands-on training.',
      targetCourseId: 'civil-primavera-p6',
    },
  ];

  const handleCardClick = (targetCourseId: string) => {
    const course = COURSES.find((c) => c.id === targetCourseId) || COURSES[0];
    onOpenCourseModal(course);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="our-programs" className="py-20 bg-[#FFFFFF] border-b border-[#CBD5E1]">
      <div className="cad-container">
        {/* Header - Centered as in user Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider uppercase">
            CAREER-DRIVEN CURRICULUM
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#15304C] tracking-tight uppercase">
            Our Programs
          </h2>
          <div className="w-16 h-1 bg-[#D20A0B] mx-auto mt-4"></div>
        </motion.div>

        {/* 3x2 Grid Matching User Image 2 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {programs.map((program) => (
            <motion.div
              key={program.id}
              variants={cardVariants}
              className="group bg-[#FFFFFF] border-2 border-[#15304C] p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                {/* Course Image Inset */}
                <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-[#CBD5E1] border border-[#CBD5E1] mb-5">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#15304C] text-center mb-3 tracking-tight group-hover:text-[#D20A0B] transition-colors">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#475569] leading-relaxed text-center mb-6 px-1 line-clamp-4 min-h-[64px]">
                  {program.description}
                </p>
              </div>

              {/* View Course Button (Red #D20A0B) */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => handleCardClick(program.targetCourseId)}
                  className="px-6 py-2.5 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold uppercase transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  View Course
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More Programs Action Button (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <button
            onClick={onExploreMore}
            className="px-10 py-3.5 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            More Programs
          </button>
        </motion.div>
      </div>
    </section>
  );
};
