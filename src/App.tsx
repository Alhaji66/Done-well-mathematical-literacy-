import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AuthProvider } from "./context/AuthContext";

import { Home } from "./pages/public/Home";
import { SignIn } from "./pages/public/SignIn";

import { LearnerLayout } from "./pages/learner/LearnerLayout";
import { LearnerDashboard } from "./pages/learner/LearnerDashboard";
import { LearnerLearn } from "./pages/learner/LearnerLearn";
import { LearnerPractise } from "./pages/learner/LearnerPractise";
import { LearnerTests } from "./pages/learner/LearnerTests";
import { LearnerProgress } from "./pages/learner/LearnerProgress";

import { ParentLayout } from "./pages/parent/ParentLayout";
import { ParentDashboard } from "./pages/parent/ParentDashboard";
import { ParentMyChild } from "./pages/parent/ParentMyChild";
import { ParentSupport } from "./pages/parent/ParentSupport";
import { ParentResources } from "./pages/parent/ParentResources";

import { TeacherLayout } from "./pages/teacher/TeacherLayout";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { TeacherResources } from "./pages/teacher/TeacherResources";
import { TeacherQuestionBank } from "./pages/teacher/TeacherQuestionBank";
import { TeacherAssessments } from "./pages/teacher/TeacherAssessments";
import { TeacherAnalytics } from "./pages/teacher/TeacherAnalytics";

import { SchoolLayout } from "./pages/school/SchoolLayout";
import { SchoolDashboard } from "./pages/school/SchoolDashboard";
import { SchoolLearners } from "./pages/school/SchoolLearners";
import { SchoolTeachers } from "./pages/school/SchoolTeachers";
import { SchoolAssessments } from "./pages/school/SchoolAssessments";
import { SchoolAnalytics } from "./pages/school/SchoolAnalytics";

import { NotFound } from "./pages/public/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Route>

          <Route path="/learner" element={<LearnerLayout />}>
            <Route index element={<LearnerDashboard />} />
            <Route path="learn" element={<LearnerLearn />} />
            <Route path="practise" element={<LearnerPractise />} />
            <Route path="tests" element={<LearnerTests />} />
            <Route path="progress" element={<LearnerProgress />} />
          </Route>

          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
            <Route path="my-child" element={<ParentMyChild />} />
            <Route path="support" element={<ParentSupport />} />
            <Route path="resources" element={<ParentResources />} />
          </Route>

          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="resources" element={<TeacherResources />} />
            <Route path="question-bank" element={<TeacherQuestionBank />} />
            <Route path="assessments" element={<TeacherAssessments />} />
            <Route path="analytics" element={<TeacherAnalytics />} />
          </Route>

          <Route path="/school" element={<SchoolLayout />}>
            <Route index element={<SchoolDashboard />} />
            <Route path="learners" element={<SchoolLearners />} />
            <Route path="teachers" element={<SchoolTeachers />} />
            <Route path="assessments" element={<SchoolAssessments />} />
            <Route path="analytics" element={<SchoolAnalytics />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
