import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/pages/AuthPage";
import HomePage from "./features/homepage/pages/HomePage";
import { TaskPage } from "./features/tasks/pages/TaskPage";
// import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
      <Route path="/" element={<HomePage />} />
      <Route path="task" element={<TaskPage />} />

    </Routes>
    
  );
}

export default App;
