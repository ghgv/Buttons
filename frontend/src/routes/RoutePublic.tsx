import { Navigate, Outlet } from "react-router";

interface PublicLayoutProps {
  isAuthenticated: boolean;
}

export default function RoutePublic({ isAuthenticated }: PublicLayoutProps) {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="public-layout">
      <Outlet /> {/* Aquí se renderizarán Login, Registro, etc. */}
    </div>
  );
}