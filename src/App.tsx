import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { PublicLayout } from '@/pages/public/PublicLayout'
import { AccountAuthProvider } from '@/context/AccountAuthContext'
import { AccountGate } from '@/components/layout/AccountGate'
import { AccountRoleGate } from '@/components/layout/AccountRoleGate'
import { AccountShell } from '@/components/layout/AccountShell'
import { RouteLoading } from '@/components/layout/RouteLoading'

import { RoleShell } from '@/components/layout/RoleShell'
import { RoleAutoSet } from '@/components/layout/RoleAutoSet'
import {
  learnerNav,
  parentNav,
  teacherNav,
  schoolNav,
  accountLearnerNav,
  accountTeacherNav,
  accountParentNav,
  accountSchoolNav,
} from '@/config/nav'

const Home = lazy(() => import('@/pages/public/Home').then((m) => ({ default: m.Home })))
const RoleLanding = lazy(() => import('@/pages/public/RoleLanding').then((m) => ({ default: m.RoleLanding })))
const Publications = lazy(() => import('@/pages/public/Publications').then((m) => ({ default: m.Publications })))
const PrivacyPolicy = lazy(() => import('@/pages/public/legal/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })))
const TermsOfService = lazy(() => import('@/pages/public/legal/TermsOfService').then((m) => ({ default: m.TermsOfService })))
const PopiaNotice = lazy(() => import('@/pages/public/legal/PopiaNotice').then((m) => ({ default: m.PopiaNotice })))
const SignIn = lazy(() => import('@/pages/auth/SignIn').then((m) => ({ default: m.SignIn })))

const AccountSignIn = lazy(() => import('@/pages/account/AccountSignIn').then((m) => ({ default: m.AccountSignIn })))
const AccountOnboarding = lazy(() => import('@/pages/account/AccountOnboarding').then((m) => ({ default: m.AccountOnboarding })))
const AccountIndexRedirect = lazy(() => import('@/pages/account/AccountIndexRedirect').then((m) => ({ default: m.AccountIndexRedirect })))
const AccountLearnerDashboard = lazy(() =>
  import('@/pages/account/learner/LearnerDashboard').then((m) => ({ default: m.LearnerDashboard })),
)
const AccountLearnerPractise = lazy(() =>
  import('@/pages/account/learner/LearnerPractise').then((m) => ({ default: m.LearnerPractise })),
)
const AccountLearnerProgress = lazy(() =>
  import('@/pages/account/learner/LearnerProgress').then((m) => ({ default: m.LearnerProgress })),
)
const AccountTeacherDashboard = lazy(() =>
  import('@/pages/account/teacher/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard })),
)
const AccountParentDashboard = lazy(() =>
  import('@/pages/account/parent/ParentDashboard').then((m) => ({ default: m.ParentDashboard })),
)
const AccountSchoolDashboard = lazy(() =>
  import('@/pages/account/school/SchoolDashboard').then((m) => ({ default: m.SchoolDashboard })),
)
const AccountSchoolLearners = lazy(() =>
  import('@/pages/account/school/SchoolLearners').then((m) => ({ default: m.SchoolLearners })),
)
const AccountSchoolTeachers = lazy(() =>
  import('@/pages/account/school/SchoolTeachers').then((m) => ({ default: m.SchoolTeachers })),
)
const AssessmentsBrowse = lazy(() =>
  import('@/components/assessments/AssessmentsBrowse').then((m) => ({ default: m.AssessmentsBrowse })),
)
const PaperPage = lazy(() => import('@/pages/account/assessments/PaperPage').then((m) => ({ default: m.PaperPage })))
const MasteryAnalytics = lazy(() =>
  import('@/components/analytics/MasteryAnalytics').then((m) => ({ default: m.MasteryAnalytics })),
)

const LearnerDashboard = lazy(() => import('@/pages/learner/Dashboard').then((m) => ({ default: m.LearnerDashboard })))
const LearnerLearn = lazy(() => import('@/pages/learner/Learn').then((m) => ({ default: m.LearnerLearn })))
const LearnerPractise = lazy(() => import('@/pages/learner/Practise').then((m) => ({ default: m.LearnerPractise })))
const LearnerTests = lazy(() => import('@/pages/learner/Tests').then((m) => ({ default: m.LearnerTests })))
const LearnerProgress = lazy(() => import('@/pages/learner/Progress').then((m) => ({ default: m.LearnerProgress })))

const ParentDashboard = lazy(() => import('@/pages/parent/Dashboard').then((m) => ({ default: m.ParentDashboard })))
const ParentMyChild = lazy(() => import('@/pages/parent/MyChild').then((m) => ({ default: m.ParentMyChild })))
const ParentSupport = lazy(() => import('@/pages/parent/Support').then((m) => ({ default: m.ParentSupport })))
const ParentResources = lazy(() => import('@/pages/parent/Resources').then((m) => ({ default: m.ParentResources })))

const TeacherDashboard = lazy(() => import('@/pages/teacher/Dashboard').then((m) => ({ default: m.TeacherDashboard })))
const TeacherResources = lazy(() => import('@/pages/teacher/Resources').then((m) => ({ default: m.TeacherResources })))
const TeacherQuestionBank = lazy(() =>
  import('@/pages/teacher/QuestionBank').then((m) => ({ default: m.TeacherQuestionBank })),
)
const TeacherAssessments = lazy(() =>
  import('@/pages/teacher/Assessments').then((m) => ({ default: m.TeacherAssessments })),
)
const TeacherAnalytics = lazy(() => import('@/pages/teacher/Analytics').then((m) => ({ default: m.TeacherAnalytics })))

const SchoolDashboard = lazy(() => import('@/pages/school/Dashboard').then((m) => ({ default: m.SchoolDashboard })))
const SchoolLearners = lazy(() => import('@/pages/school/Learners').then((m) => ({ default: m.SchoolLearners })))
const SchoolTeachers = lazy(() => import('@/pages/school/Teachers').then((m) => ({ default: m.SchoolTeachers })))
const SchoolAssessments = lazy(() =>
  import('@/pages/school/Assessments').then((m) => ({ default: m.SchoolAssessments })),
)
const SchoolAnalytics = lazy(() => import('@/pages/school/Analytics').then((m) => ({ default: m.SchoolAnalytics })))

export default function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learners" element={<RoleLanding role="learner" />} />
          <Route path="/parents" element={<RoleLanding role="parent" />} />
          <Route path="/teachers" element={<RoleLanding role="teacher" />} />
          <Route path="/schools" element={<RoleLanding role="school" />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/popia" element={<PopiaNotice />} />
        </Route>

        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/account"
          element={
            <AccountAuthProvider>
              <Outlet />
            </AccountAuthProvider>
          }
        >
          <Route path="sign-in" element={<AccountSignIn />} />
          <Route element={<AccountGate require="session" />}>
            <Route path="onboarding" element={<AccountOnboarding />} />
          </Route>
          <Route element={<AccountGate require="profile" />}>
            <Route index element={<AccountIndexRedirect />} />

            <Route element={<AccountRoleGate role="learner" />}>
              <Route path="learner" element={<AccountShell basePath="/account/learner" navItems={accountLearnerNav} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AccountLearnerDashboard />} />
                <Route path="practise" element={<AccountLearnerPractise />} />
                <Route path="assessments" element={<AssessmentsBrowse />} />
                <Route path="assessments/:paperId" element={<PaperPage />} />
                <Route path="progress" element={<AccountLearnerProgress />} />
              </Route>
            </Route>

            <Route element={<AccountRoleGate role="teacher" />}>
              <Route path="teacher" element={<AccountShell basePath="/account/teacher" navItems={accountTeacherNav} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AccountTeacherDashboard />} />
                <Route path="resources" element={<TeacherResources />} />
                <Route path="question-bank" element={<TeacherQuestionBank />} />
                <Route path="assessments" element={<AssessmentsBrowse />} />
                <Route path="assessments/:paperId" element={<PaperPage />} />
                <Route path="analytics" element={<MasteryAnalytics />} />
              </Route>
            </Route>

            <Route element={<AccountRoleGate role="parent" />}>
              <Route path="parent" element={<AccountShell basePath="/account/parent" navItems={accountParentNav} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AccountParentDashboard />} />
                <Route path="support" element={<ParentSupport />} />
              </Route>
            </Route>

            <Route element={<AccountRoleGate role="school" />}>
              <Route path="school" element={<AccountShell basePath="/account/school" navItems={accountSchoolNav} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AccountSchoolDashboard />} />
                <Route path="learners" element={<AccountSchoolLearners />} />
                <Route path="teachers" element={<AccountSchoolTeachers />} />
                <Route path="assessments" element={<AssessmentsBrowse />} />
                <Route path="assessments/:paperId" element={<PaperPage />} />
                <Route path="analytics" element={<MasteryAnalytics />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route
          path="/app/learner"
          element={
            <>
              <RoleAutoSet role="learner" />
              <RoleShell role="learner" basePath="/app/learner" navItems={learnerNav} />
            </>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<LearnerDashboard />} />
          <Route path="learn" element={<LearnerLearn />} />
          <Route path="practise" element={<LearnerPractise />} />
          <Route path="tests" element={<LearnerTests />} />
          <Route path="progress" element={<LearnerProgress />} />
        </Route>

        <Route
          path="/app/parent"
          element={
            <>
              <RoleAutoSet role="parent" />
              <RoleShell role="parent" basePath="/app/parent" navItems={parentNav} />
            </>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="my-child" element={<ParentMyChild />} />
          <Route path="support" element={<ParentSupport />} />
          <Route path="resources" element={<ParentResources />} />
        </Route>

        <Route
          path="/app/teacher"
          element={
            <>
              <RoleAutoSet role="teacher" />
              <RoleShell role="teacher" basePath="/app/teacher" navItems={teacherNav} />
            </>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="resources" element={<TeacherResources />} />
          <Route path="question-bank" element={<TeacherQuestionBank />} />
          <Route path="assessments" element={<TeacherAssessments />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
        </Route>

        <Route
          path="/app/school"
          element={
            <>
              <RoleAutoSet role="school" />
              <RoleShell role="school" basePath="/app/school" navItems={schoolNav} />
            </>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SchoolDashboard />} />
          <Route path="learners" element={<SchoolLearners />} />
          <Route path="teachers" element={<SchoolTeachers />} />
          <Route path="assessments" element={<SchoolAssessments />} />
          <Route path="analytics" element={<SchoolAnalytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
