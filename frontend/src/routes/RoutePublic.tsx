// routes/RoutePublic.tsx
import { Navigate, Routes, Route } from "react-router";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function RoutePublic() {
  return (
    <div>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}