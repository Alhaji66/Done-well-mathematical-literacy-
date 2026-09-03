import type { RoleNavItem } from '@/components/layout/RoleShell'
import {
  HomeIcon,
  BookIcon,
  PencilIcon,
  ClipboardIcon,
  TrendingUpIcon,
  UsersIcon,
  UserIcon,
  HeartHandshakeIcon,
  BarChartIcon,
  SparkleIcon,
  SchoolIcon,
} from '@/components/ui/Icons'

export const learnerNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/learn', label: 'Learn', icon: BookIcon },
  { to: '/practise', label: 'Practise', icon: PencilIcon },
  { to: '/tests', label: 'Tests', icon: ClipboardIcon },
  { to: '/progress', label: 'Progress', icon: TrendingUpIcon },
]

export const parentNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/my-child', label: 'My Child', icon: UserIcon },
  { to: '/support', label: 'Support', icon: HeartHandshakeIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
]

export const teacherNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/question-bank', label: 'Question Bank', icon: SparkleIcon },
  { to: '/assessments', label: 'Assessments', icon: ClipboardIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
]

export const schoolNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/learners', label: 'Learners', icon: UsersIcon },
  { to: '/teachers', label: 'Teachers', icon: SchoolIcon },
  { to: '/assessments', label: 'Assessments', icon: ClipboardIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
]
