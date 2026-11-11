import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RND CADD | Civil, Mechanical & EEE CAD Training Institute | Ameerpet',
  description: 'RND CADD - Premier CAD, CAM, CAE & BIM Training Institute in Ameerpet, Hyderabad. Certified Civil, Mechanical, and Electrical (EEE) programs with MongoDB & Cloudflare R2 LMS architecture.',
  keywords: ['RND CADD', 'CAD Training Ameerpet', 'Revit BIM Course Hyderabad', 'SolidWorks Certification', 'AutoCAD Electrical', 'EPLAN P8', 'STAAD.Pro', 'ANSYS Workbench'],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-[#0F172A] min-h-screen antialiased selection:bg-[#D20A0B] selection:text-[#FFFFFF]">
        {children}
      </body>
    </html>
  );
}
