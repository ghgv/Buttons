// routes/RoutePublic.tsx
import { Navigate, Routes, Route } from "react-router";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

export default function RoutePublic() {
  return (
    <div>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}