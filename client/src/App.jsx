import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Interview from "./pages/Interview";
import InterviewSession from "./pages/InterviewSession";
import InterviewResult from "./pages/InterviewResult";
import InterviewHistory from "./pages/InterviewHistory";
import Aptitude from "./pages/Aptitude";
import AptitudeTopics from "./pages/AptitudeTopics";
import AptitudeLearn from "./pages/AptitudeLearn";
import AptitudePractice from "./pages/AptitudePractice";
import AptitudeTest from "./pages/AptitudeTest";
import AptitudeResult from "./pages/AptitudeResult";
import AptitudeHistory from "./pages/AptitudeHistory";
import ResumeManagement from "./pages/ResumeManagement";
import ResumeBuilder from "./pages/ResumeBuilder";
import TemplateSelectionPage from "./pages/TemplateSelectionPage";
import ResumePreviewPage from "./pages/ResumePreviewPage";
import PublicResumeView from "./pages/PublicResumeView";
import LandingPage from "./pages/LandingPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/view/:id" element={<PublicResumeView />} />
      <Route path="/share/:id" element={<PublicResumeView />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resumes"
        element={
          <ProtectedRoute>
            <ResumeManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={<Navigate to="/resumes" replace />}
      />
      <Route
        path="/resume/new"
        element={
          <ProtectedRoute>
            <TemplateSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id/edit"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id/preview"
        element={
          <ProtectedRoute>
            <ResumePreviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Interview Routes */}
      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={<Navigate to="/interviews" replace />}
      />
      <Route
        path="/interviews/session"
        element={
          <ProtectedRoute>
            <InterviewSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews/result"
        element={
          <ProtectedRoute>
            <InterviewResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews/result/:id"
        element={
          <ProtectedRoute>
            <InterviewResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews/history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />
      {/* Aptitude Routes */}
      <Route
        path="/aptitude"
        element={
          <ProtectedRoute>
            <Aptitude />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/topics"
        element={
          <ProtectedRoute>
            <AptitudeTopics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/learn/:topicId"
        element={
          <ProtectedRoute>
            <AptitudeLearn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/practice"
        element={
          <ProtectedRoute>
            <AptitudePractice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/practice/:topicId"
        element={
          <ProtectedRoute>
            <AptitudePractice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/test"
        element={
          <ProtectedRoute>
            <AptitudeTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/result"
        element={
          <ProtectedRoute>
            <AptitudeResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/result/:attemptId"
        element={
          <ProtectedRoute>
            <AptitudeResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/history"
        element={
          <ProtectedRoute>
            <AptitudeHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;