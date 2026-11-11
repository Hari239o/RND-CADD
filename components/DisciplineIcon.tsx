import React from 'react';

interface DisciplineIconProps {
  disciplineId: string;
  isSelected?: boolean;
  className?: string;
}

export const DisciplineIcon: React.FC<DisciplineIconProps> = ({
  disciplineId,
  isSelected = false,
  className = 'w-5 h-5 flex-shrink-0',
}) => {
  const strokeColor = isSelected ? '#FFFFFF' : '#1E293B';
  const redAccent = isSelected ? '#FFFFFF' : '#EE2C3C';
  const redFill = isSelected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(238, 44, 60, 0.18)';

  switch (disciplineId.toLowerCase()) {
    case 'all':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Mortarboard cap top */}
          <path
            d="M12 3L2 8L12 13L22 8L12 3Z"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={redFill}
          />
          {/* Cap bottom contour */}
          <path
            d="M6 10.5V16C6 18.5 8.7 20.5 12 20.5C15.3 20.5 18 18.5 18 16V10.5"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Red decorative tassel */}
          <path
            d="M20 9V15C20 15.6 19.5 16 19 16"
            stroke={redAccent}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="19" cy="16.5" r="1.5" fill={redAccent} />
        </svg>
      );

    case 'civil':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Classical pediment roof with red architectural accent */}
          <path
            d="M3 8L12 3L21 8H3Z"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill={redFill}
          />
          <circle cx="12" cy="3.5" r="1" fill={redAccent} />
          {/* Pillars */}
          <path
            d="M6 8V18M10 8V18M14 8V18M18 8V18"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Base foundation */}
          <path
            d="M2 18H22M4 21H20"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mechanical':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Main Gear */}
          <circle cx="10" cy="12" r="5" stroke={strokeColor} strokeWidth="1.8" />
          <path
            d="M10 4V6M10 18V20M2 12H4M16 12H18M4.3 6.3L5.7 7.7M14.3 16.3L15.7 17.7M4.3 17.7L5.7 16.3M14.3 7.7L15.7 6.3"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Red inner drive hub */}
          <circle cx="10" cy="12" r="2.2" fill={redAccent} />
          {/* Small interlocking gear */}
          <circle cx="18" cy="7" r="3" stroke={redAccent} strokeWidth="1.5" />
          <path
            d="M18 2.5V3.5M18 10.5V11.5M13.5 7H14.5M21.5 7H22.5"
            stroke={redAccent}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'eee':
    case 'electrical':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Integrated Circuit Chip body */}
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            stroke={strokeColor}
            strokeWidth="1.8"
            fill={redFill}
          />
          {/* External Pins */}
          <path
            d="M2 9H4M2 15H4M20 9H22M20 15H22M9 2V4M15 2V4M9 20V22M15 20V22"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Dynamic Red Lightning Bolt Core */}
          <path
            d="M13 7L8.5 13H13.5L11 17L16 11H11.5L13 7Z"
            fill={redAccent}
            stroke={redAccent}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'interior':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Modern Designer Lounge Armchair */}
          <path
            d="M6 10C6 6.5 8 5 12 5C16 5 18 6.5 18 10V14H6V10Z"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Red comfort cushion */}
          <rect
            x="4"
            y="13"
            width="16"
            height="4"
            rx="2"
            fill={redAccent}
            stroke={redAccent}
            strokeWidth="1"
          />
          {/* Armrests */}
          <path d="M4 11V15M20 11V15" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          {/* Tapered legs */}
          <path
            d="M6 17L4.5 21M18 17L19.5 21"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'piping':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Industrial Process Pipeline */}
          <path d="M2 13H8M16 13H22" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="4" y1="10" x2="4" y2="16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="10" x2="20" y2="16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          {/* Valve Body with Red Fill */}
          <path
            d="M8 9L16 17H8L16 9H8Z"
            stroke={strokeColor}
            strokeWidth="1.5"
            fill={redFill}
          />
          {/* Red Control Handwheel */}
          <line x1="12" y1="9" x2="12" y2="5" stroke={redAccent} strokeWidth="2" />
          <ellipse
            cx="12"
            cy="5"
            rx="3.5"
            ry="1.5"
            fill={redAccent}
            stroke={redAccent}
            strokeWidth="1"
          />
        </svg>
      );

    case 'ppm':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Project Management Milestone Tracks */}
          <rect x="3" y="5" width="8" height="3" rx="1.5" fill={strokeColor} />
          <rect x="7" y="11" width="10" height="3" rx="1.5" fill={strokeColor} />
          <rect x="4" y="17" width="13" height="3" rx="1.5" fill={redAccent} />
          {/* Milestone Flag */}
          <path
            d="M19 13V21M19 13L23 15.5L19 18"
            stroke={redAccent}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Connecting dependency lines */}
          <path
            d="M7 8V11M12 14V17"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
        </svg>
      );

    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth="1.8" />
          <path d="M12 7V12L15 15" stroke={redAccent} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
};
