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
  EyeIcon,
  SchoolIcon,
} from '@/components/ui/Icons'

export const learnerNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/learn', label: 'Learn', icon: BookIcon },
  { to: '/practise', label: 'Practise', icon: PencilIcon },
  { to: '/assessments', label: 'Assessments', icon: ClipboardIcon },
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

// Real (non-demo) Learner account nav -- deliberately smaller than the demo's
// learnerNav above: Learn isn't built for real accounts yet. Assessments here
// tracks real per-topic mastery server-side; the demo's Assessments (same
// papers.ts content) only tracks per-paper progress locally, since there's no
// signed-in account to save it against.
export const accountLearnerNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/practise', label: 'Practise', icon: PencilIcon },
  { to: '/assessments', label: 'Assessments', icon: ClipboardIcon },
  { to: '/progress', label: 'Progress', icon: TrendingUpIcon },
  { to: '/privacy', label: 'Privacy & data', icon: EyeIcon },
]

// Real (non-demo) Teacher account nav -- Assessments/Analytics are now built:
// Assessments is a read-only view of the same practice papers library
// Learners see; Analytics is a per-topic mastery breakdown across the
// school's roster (no per-class data exists yet, so it's school-wide).
export const accountTeacherNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/question-bank', label: 'Question Bank', icon: SparkleIcon },
  { to: '/assessments', label: 'Assessments', icon: ClipboardIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
  { to: '/privacy', label: 'Privacy & data', icon: EyeIcon },
]

// Real (non-demo) Parent account nav -- My Child is folded into Dashboard
// (it already shows each linked child's progress); Resources filters
// resources.ts to each linked child's real grade and subject.
export const accountParentNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/support', label: 'Support', icon: HeartHandshakeIcon },
  { to: '/privacy', label: 'Privacy & data', icon: EyeIcon },
]

// Real (non-demo) School account nav -- Assessments/Analytics now built,
// same reasoning as Teacher's.
export const accountSchoolNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/learners', label: 'Learners', icon: UsersIcon },
  { to: '/teachers', label: 'Teachers', icon: SchoolIcon },
  { to: '/assessments', label: 'Assessments', icon: ClipboardIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
  { to: '/privacy', label: 'Privacy & data', icon: EyeIcon },
]
