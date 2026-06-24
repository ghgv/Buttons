// routes/index.tsx
import { Routes, Route } from "react-router";
import { useAuth } from "../hooks/useAuth";
import RoutePublic from "./RoutePublic";
import RoutePrivate from "./RoutePrivate";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={<RoutePrivate />} />
      ) : (
        <Route path="/*" element={<RoutePublic />} />
      )}
    </Routes>
  );
}