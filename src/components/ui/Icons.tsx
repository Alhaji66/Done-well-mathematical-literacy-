import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
)

export const BookIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21" />
    <path d="M4 5.5v15.5" />
    <path d="M20 18.5H6.5A2.5 2.5 0 0 0 4 21" />
  </svg>
)

export const PencilIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" />
  </svg>
)

export const ClipboardIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="M9 11h6M9 15h6M9 19h3" />
  </svg>
)

export const TrendingUpIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
)

export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16.5 5.5a3.2 3.2 0 0 1 0 6.2" />
    <path d="M21.5 20a6 6 0 0 0-4.5-8" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
)

export const SchoolIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 2 8l10 5 10-5-10-5Z" />
    <path d="M6 11v6c0 1 2.7 3 6 3s6-2 6-3v-6" />
    <path d="M22 8v7" />
  </svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
)

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)

export const CheckCircleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.3 2.3 4.7-5.1" />
  </svg>
)

export const XCircleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9.5 9.5 5 5M14.5 9.5l-5 5" />
  </svg>
)

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.5l3.5 2" />
  </svg>
)

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)

export const TargetIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
)

export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 22 20H2Z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
)

export const MessageIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4.5h16v12H8l-4 4Z" />
  </svg>
)

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M4 19.5h16" />
  </svg>
)

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
)

export const FilterIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5h16M7 12h10M10.5 19h3" />
  </svg>
)

export const SparkleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
)

export const BarChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20V10M12 20V4M20 20v-7" />
    <path d="M2 20h20" />
  </svg>
)

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const LayoutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M3.5 9.5h17M9.5 9.5v11" />
  </svg>
)

export const MapIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6l-6-2Z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)

export const HeartHandshakeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m2.5 12.5 4-4 3 2h4l4-4 4 4-6 6-3-1.5" />
    <path d="m8 11 3 3-2.5 2.5a2 2 0 0 1-3-2.6" />
  </svg>
)

export const StarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L6.6 19.3l1.3-6-4.6-4.1 6.1-.6Z" />
  </svg>
)

export const LogOutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
)
