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
        name: 'CIVIL CADD',
        headline: 'Autodesk & Bentley Civil Structural Excellence Lab',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'mechanical',
        name: 'MECHANICAL',
        headline: 'Dassault & SolidWorks Advanced Engineering Center',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'electrical',
        name: 'ELECTRICAL',
        headline: 'EPLAN & Industrial Automation Control Center',
        image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80',
        bgImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'interior',
        name: 'INTERIOR',
        headline: 'Chaos Group & 3ds Max Architectural Studio',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'piping',
        name: 'PIPING',
        headline: 'Process Plant Engineering & SP3D Simulation Lab',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        bgImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'ppm',
        name: 'PPM',
        headline: 'Oracle Primavera P6 Project Management Lab',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
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
