import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/pages/AuthPage";
import HomePage from "./features/homepage/pages/HomePage";
import ForgotPassword from "./features/auth/pages/ForgotPasswordPage";
import ResetPassword from "./features/auth/pages/ResetPassword";
import ProjectDetailPage from "./features/projects/pages/ProjectDetailPage";
import DashboardLayout from "./features/shared/layout/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Public / Auth */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/projects/:projectId"
          element={<ProjectDetailPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
