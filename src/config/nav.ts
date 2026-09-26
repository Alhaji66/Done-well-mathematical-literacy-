import type { RoleNavItem } from '@/components/layout/RoleShell'
import {
  ClockIcon,
  HomeIcon,
  BookIcon,
  PencilIcon,
  ClipboardIcon,
  TrendingUpIcon,
  UsersIcon,
  LayoutIcon,
  TargetIcon,
  AlertIcon,
  DownloadIcon,
  UserIcon,
  HeartHandshakeIcon,
  BarChartIcon,
  ClipboardCheckIcon,
  SparkleIcon,
  CalendarIcon,
  EyeIcon,
  SchoolIcon,
} from '@/components/ui/Icons'

export const learnerNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: HomeIcon },
  { to: '/learn', label: 'Learn', icon: BookIcon },
  { to: '/practise', label: 'Practise', icon: PencilIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/tests', label: 'Weekly tests', shortLabel: 'Tests', icon: ClipboardIcon },
  { to: '/progress', label: 'Progress', icon: TrendingUpIcon },
  // Six tabs already fill a phone's bottom bar; on a phone these are reached
  // from Home instead (My Mistakes from Progress too).
  { to: '/mistakes', label: 'My Mistakes', icon: AlertIcon, phone: false },
  { to: '/countdown', label: 'Exam countdown', icon: CalendarIcon, phone: false },
  { to: '/tutor', label: 'Check my working', icon: SparkleIcon, phone: false },
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
  { to: '/question-bank', label: 'Question Bank', shortLabel: 'Bank', icon: SparkleIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
]

// Demo Head of Department nav. Smaller than the real one: the demo's job is
// to show what the role is for, not to be a working department console.
export const hodNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/question-bank', label: 'Question Bank', shortLabel: 'Bank', icon: SparkleIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
]

export const schoolNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/learners', label: 'Learners', icon: UsersIcon },
  { to: '/teachers', label: 'Teachers', icon: SchoolIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
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
  { to: '/mistakes', label: 'My Mistakes', shortLabel: 'Mistakes', icon: AlertIcon },
  { to: '/countdown', label: 'Exam countdown', shortLabel: 'Countdown', icon: CalendarIcon },
  { to: '/tutor', label: 'Check my working', shortLabel: 'Tutor', icon: SparkleIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/progress', label: 'Progress', icon: TrendingUpIcon },
  { to: '/privacy', label: 'Privacy & data', shortLabel: 'Privacy', icon: EyeIcon },
]

// Real (non-demo) Teacher account nav -- Assessments/Analytics are now built:
// Assessments is a read-only view of the same practice papers library
// Learners see; Analytics is a per-topic mastery breakdown across the
// school's roster (no per-class data exists yet, so it's school-wide).
export const accountTeacherNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/classes', label: 'Classes', icon: UsersIcon },
  { to: '/interventions', label: 'Catch-up groups', shortLabel: 'Catch-up', icon: TargetIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/question-bank', label: 'Question Bank', shortLabel: 'Bank', icon: SparkleIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/tests', label: 'Weekly tests', shortLabel: 'Tests', icon: ClipboardCheckIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
  { to: '/reports', label: 'Reports', icon: DownloadIcon },
  { to: '/coverage', label: 'Coverage', icon: ClipboardCheckIcon },
  { to: '/activity', label: 'Activity log', shortLabel: 'Activity', icon: ClockIcon },
  { to: '/privacy', label: 'Privacy & data', shortLabel: 'Privacy', icon: EyeIcon },
]

// Real (non-demo) Parent account nav -- My Child is folded into Dashboard
// (it already shows each linked child's progress); Resources filters
// resources.ts to each linked child's real grade and subject.
export const accountParentNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/support', label: 'Support', icon: HeartHandshakeIcon },
  { to: '/privacy', label: 'Privacy & data', shortLabel: 'Privacy', icon: EyeIcon },
]

// Real (non-demo) School account nav -- Assessments/Analytics now built,
// same reasoning as Teacher's.
// Real (non-demo) Head of Department nav. Same shape as the teacher nav, minus
// the authoring tools an HOD does not need and plus the two department rolls.
export const accountHodNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/teachers', label: 'Teachers', icon: SchoolIcon },
  { to: '/learners', label: 'Learners', icon: UsersIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/classes', label: 'Classes', icon: LayoutIcon },
  { to: '/interventions', label: 'Catch-up groups', shortLabel: 'Catch-up', icon: TargetIcon },
  { to: '/question-bank', label: 'Question Bank', shortLabel: 'Bank', icon: SparkleIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/tests', label: 'Weekly tests', shortLabel: 'Tests', icon: ClipboardCheckIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
  { to: '/reports', label: 'Reports', icon: DownloadIcon },
  { to: '/coverage', label: 'Coverage', icon: ClipboardCheckIcon },
  { to: '/activity', label: 'Activity log', shortLabel: 'Activity', icon: ClockIcon },
  { to: '/privacy', label: 'Privacy & data', shortLabel: 'Privacy', icon: EyeIcon },
]

export const accountSchoolNav: RoleNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/learners', label: 'Learners', icon: UsersIcon },
  { to: '/classes', label: 'Classes', icon: LayoutIcon },
  { to: '/interventions', label: 'Catch-up groups', shortLabel: 'Catch-up', icon: TargetIcon },
  { to: '/teachers', label: 'Teachers', icon: SchoolIcon },
  { to: '/resources', label: 'Resources', icon: BookIcon },
  { to: '/assessments', label: 'Assessments', shortLabel: 'Papers', icon: ClipboardIcon },
  { to: '/tests', label: 'Weekly tests', shortLabel: 'Tests', icon: ClipboardCheckIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChartIcon },
  { to: '/reports', label: 'Reports', icon: DownloadIcon },
  { to: '/coverage', label: 'Coverage', icon: ClipboardCheckIcon },
  { to: '/activity', label: 'Activity log', shortLabel: 'Activity', icon: ClockIcon },
  { to: '/privacy', label: 'Privacy & data', shortLabel: 'Privacy', icon: EyeIcon },
]
