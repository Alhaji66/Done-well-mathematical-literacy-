import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/pages/public/PublicLayout'
import { Home } from '@/pages/public/Home'
import { RoleLanding } from '@/pages/public/RoleLanding'
import { Publications } from '@/pages/public/Publications'
import { SignIn } from '@/pages/auth/SignIn'

import { RoleShell } from '@/components/layout/RoleShell'
import { RoleAutoSet } from '@/components/layout/RoleAutoSet'
import { learnerNav, parentNav, teacherNav, schoolNav } from '@/config/nav'

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
      </Route>

      <Route path="/sign-in" element={<SignIn />} />

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
