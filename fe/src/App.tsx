import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/pages/AuthPage";
import HomePage from "./features/homepage/pages/HomePage";
import { TaskPage } from "./features/tasks/pages/TaskPage";
import ForgotPassword from "./features/auth/pages/ForgotPasswordPage";
import ResetPassword from "./features/auth/pages/ResetPassword";
// import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
      <Route path="/" element={<HomePage />} />
      <Route path="task" element={<TaskPage />} />
      <Route path="forgot-password" element={<ForgotPassword/>}/>
      <Route path="reset-password" element={<ResetPassword/>}/>
    </Routes>
    
  );
}

export default App;
