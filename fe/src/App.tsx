import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/pages/AuthPage";
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
    
  );
}

export default App;
