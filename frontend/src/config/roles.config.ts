// config/roles.config.ts

export const ROLES = {
  CLIENT_ADMIN: "client_admin",
  SUPERVISOR: "supervisor",
  NUBEWARE_ADMIN: "nubeware_admin",
  TECHNICIAN: "technician",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_ROUTES: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: "/admin/dashboard",
  [ROLES.SUPERVISOR]: "/admin/asignaciones",
  [ROLES.NUBEWARE_ADMIN]: "/nubeware/dashboard",
  [ROLES.TECHNICIAN]: "/login",
};

export const ROLE_NAMES: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: "Administrador",
  [ROLES.SUPERVISOR]: "Supervisor",
  [ROLES.NUBEWARE_ADMIN]: "Administrador Nubeware",
  [ROLES.TECHNICIAN]: "Técnico",
};

export const ROLE_LAYOUTS: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: "AdminLayout",
  [ROLES.SUPERVISOR]: "AdminLayout",
  [ROLES.NUBEWARE_ADMIN]: "NubewareLayout",
  [ROLES.TECHNICIAN]: "Mobile",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: "Acceso administrativo",
  [ROLES.SUPERVISOR]: "Gestión de asignaciones",
  [ROLES.NUBEWARE_ADMIN]: "Administración de Nubeware",
  [ROLES.TECHNICIAN]: "Atención de incidentes asignados",
};

export const getRedirectPath = (
  role: string | undefined
): string => {
  if (!role) return "/login";

  return ROLE_ROUTES[role as UserRole] || "/login";
};

export const getRoleName = (
  role: string | undefined
): string => {
  if (!role) return "Usuario";

  return ROLE_NAMES[role as UserRole] || role;
};

export const hasRoleAccess = (
  role: string | undefined,
  allowedRoles: string[]
): boolean => {
  if (!role) return false;

  return allowedRoles.includes(role);
};