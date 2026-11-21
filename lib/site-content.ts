export interface HeroSectionContent {
  hidden: boolean;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage: string;
}

export interface ProgramDomainItem {
  id: string;
  name: string;
  headline: string;
  image: string;
  bgImage: string;
}

export interface ProgramsSectionContent {
  hidden: boolean;
  badge: string;
  heading: string;
  subheading: string;
  domains: ProgramDomainItem[];
}

export interface CatalogSectionContent {
  hidden: boolean;
  badge: string;
  heading: string;
  subheading: string;
}

export interface PartnersSectionContent {
  hidden: boolean;
  badge: string;
  heading: string;
  subheading: string;
  partners: string[];
}

export interface EnrollmentSectionContent {
  hidden: boolean;
  badge: string;
  heading: string;
  subheading: string;
  helplinePhone: string;
  labHours: string;
  guaranteeBadge: string;
}

export interface FooterSectionContent {
  hidden: boolean;
  bannerBadge: string;
  bannerHeading: string;
  bannerButtonText: string;
  aboutText: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  copyright: string;
  accreditations: string[];
}

export interface SiteContent {
  hero: HeroSectionContent;
  programs: ProgramsSectionContent;
  catalog: CatalogSectionContent;
  partners: PartnersSectionContent;
  enrollment: EnrollmentSectionContent;
  footer: FooterSectionContent;
  updatedAt?: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    hidden: false,
    badge: 'Industry 4.0 CAD & BIM Academy',
    title: 'Master Industrial CAD.',
    highlight: 'Build Your Future.',
    description: 'Premier institute for Civil, Mechanical, and Electrical engineers. Industry-certified workflows with hands-on workstation practice.',
    primaryCtaText: 'Explore Programs',
    primaryCtaLink: '#revealed-courses',
    secondaryCtaText: 'Reserve Workstation',
    secondaryCtaLink: '#enrollment',
    heroImage: '/logo_mark.png',
  },
  programs: {
    hidden: false,
    badge: 'Global Certified Programs',
    heading: 'Explore Programs By Engineering Domain',
    subheading: 'Industry-accredited multi-week professional tracks with real-time project deliverables.',
    domains: [
      {
        id: 'civil',
        name: 'Civil & BIM',
        headline: 'Civil CAD, Revit BIM & Structural Modeling',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
        bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'mechanical',
        name: 'Mechanical',
        headline: 'SolidWorks, CATIA & Parametric Product Design',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        bgImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'eee',
        name: 'Electrical',
        headline: 'AutoCAD Electrical, EPLAN & Control Panel Schematics',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        bgImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'interior',
        name: 'Interior',
        headline: '3ds Max, V-Ray, SketchUp & Photorealistic Renders',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
        bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'piping',
        name: 'Piping',
        headline: 'SP3D, PDMS, Plant 3D & Isometric Isogen Flow',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      },
      {
        id: 'ppm',
        name: 'PPM',
        headline: 'Primavera P6, MS Project & EPC Schedule Analytics',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
        bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      },
    ],
  },
  catalog: {
    hidden: false,
    badge: 'Master Curriculum',
    heading: 'Comprehensive CAD Engineering Programs',
    subheading: 'Explore our certified professional courses with dedicated software tracks and hands-on lab projects.',
  },
  partners: {
    hidden: false,
    badge: 'Career Ecosystem',
    heading: 'Top Hiring Engineering Partners & EPC Giants',
    subheading: 'Over 500+ leading multinational corporations recruit directly from RND CADD Academy.',
    partners: [
      'L&T Construction',
      'Tata Projects',
      'Megha Engineering (MEIL)',
      'Afcons Infrastructure',
      'Shapoorji Pallonji',
      'GMR Infrastructure',
      'Balfour Beatty',
      'Jacobs Engineering',
      'Technip Energies',
      'Kiewit EPC',
    ],
  },
  enrollment: {
    hidden: false,
    badge: 'Admissions Open • Batch 2026',
    heading: 'Reserve Your CAD Workstation Seat',
    subheading: 'Enter your details to reserve a workstation seat for practical training in our Ameerpet high-spec lab.',
    helplinePhone: '+91 99081 23456',
    labHours: '7:00 AM – 9:30 PM (7 Days)',
    guaranteeBadge: 'Zero Reservation Fee',
  },
  footer: {
    hidden: false,
    bannerBadge: 'Free CAD Demo Sessions Weekly',
    bannerHeading: 'Ready to Upgrade Your Engineering Career?',
    bannerButtonText: 'Book a Free Demo Class',
    aboutText: 'Premier CAD, CAM, CAE, and BIM training institute based in Ameerpet, Hyderabad. Empowering engineering graduates and professionals with industry-accredited design expertise.',
    address: 'RND CADD Center, Metro Pillar 1042, Beside Ameerpet Metro Station, Ameerpet, Hyderabad, Telangana 500038',
    phone: '+91 99081 23456',
    email: 'admissions@rndcadd.com',
    whatsapp: '+91 99081 23456',
    copyright: '© 2026 RND CADD Training Institute. All rights reserved.',
    accreditations: ['Autodesk', 'Dassault', 'Bentley', 'Oracle P6', 'PTC Creo', 'Siemens'],
  },
};
