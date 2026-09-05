import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { PublicLayout } from '@/pages/public/PublicLayout'
import { Home } from '@/pages/public/Home'
import { RoleLanding } from '@/pages/public/RoleLanding'
import { Publications } from '@/pages/public/Publications'
import { PrivacyPolicy } from '@/pages/public/legal/PrivacyPolicy'
import { TermsOfService } from '@/pages/public/legal/TermsOfService'
import { PopiaNotice } from '@/pages/public/legal/PopiaNotice'
import { SignIn } from '@/pages/auth/SignIn'
import { AccountAuthProvider } from '@/context/AccountAuthContext'
import { AccountGate } from '@/components/layout/AccountGate'
import { AccountRoleGate } from '@/components/layout/AccountRoleGate'
import { AccountShell } from '@/components/layout/AccountShell'
import { AccountSignIn } from '@/pages/account/AccountSignIn'
import { AccountOnboarding } from '@/pages/account/AccountOnboarding'
import { AccountIndexRedirect } from '@/pages/account/AccountIndexRedirect'
import { LearnerDashboard as AccountLearnerDashboard } from '@/pages/account/learner/LearnerDashboard'
import { LearnerPractise as AccountLearnerPractise } from '@/pages/account/learner/LearnerPractise'
import { LearnerProgress as AccountLearnerProgress } from '@/pages/account/learner/LearnerProgress'
import { TeacherDashboard as AccountTeacherDashboard } from '@/pages/account/teacher/TeacherDashboard'
import { ParentDashboard as AccountParentDashboard } from '@/pages/account/parent/ParentDashboard'
import { SchoolDashboard as AccountSchoolDashboard } from '@/pages/account/school/SchoolDashboard'
import { SchoolLearners as AccountSchoolLearners } from '@/pages/account/school/SchoolLearners'
import { SchoolTeachers as AccountSchoolTeachers } from '@/pages/account/school/SchoolTeachers'
import { AssessmentsBrowse } from '@/components/assessments/AssessmentsBrowse'
import { PaperPage } from '@/pages/account/assessments/PaperPage'
import { MasteryAnalytics } from '@/components/analytics/MasteryAnalytics'

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

import { LearnerDashboard } from '@/pages/learner/Dashboard'
import { LearnerLearn } from '@/pages/learner/Learn'
import { LearnerPractise } from '@/pages/learner/Practise'
import { LearnerTests } from '@/pages/learner/Tests'
import { LearnerProgress } from '@/pages/learner/Progress'

import { ParentDashboard } from '@/pages/parent/Dashboard'
import { ParentMyChild } from '@/pages/parent/MyChild'
import { ParentSupport } from '@/pages/parent/Support'
import { ParentResources } from '@/pages/parent/Resources'

import { TeacherDashboard } from '@/pages/teacher/Dashboard'
import { TeacherResources } from '@/pages/teacher/Resources'
import { TeacherQuestionBank } from '@/pages/teacher/QuestionBank'
import { TeacherAssessments } from '@/pages/teacher/Assessments'
import { TeacherAnalytics } from '@/pages/teacher/Analytics'

import { SchoolDashboard } from '@/pages/school/Dashboard'
import { SchoolLearners } from '@/pages/school/Learners'
import { SchoolTeachers } from '@/pages/school/Teachers'
import { SchoolAssessments } from '@/pages/school/Assessments'
import { SchoolAnalytics } from '@/pages/school/Analytics'

export default function App() {
  return (
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
  )
}
