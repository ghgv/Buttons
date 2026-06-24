// config/roles.config.ts
export const ROLES = {
  CLIENT_ADMIN: 'client_admin',
  COORDINATOR: 'coordinator',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Mapeo de roles a rutas
export const ROLE_ROUTES: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: '/admin/dashboard',
  [ROLES.COORDINATOR]: '/coordinator/alertas',
};

// Mapeo de roles a nombres legibles
export const ROLE_NAMES: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: 'Administrador',
  [ROLES.COORDINATOR]: 'Coordinador',
};

// Mapeo de roles a layouts
export const ROLE_LAYOUTS: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: 'AdminLayout',
  [ROLES.COORDINATOR]: 'CoordinatorLayout',
};

// Mapeo de roles a descripciones
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [ROLES.CLIENT_ADMIN]: 'Acceso completo al sistema',
  [ROLES.COORDINATOR]: 'Acceso limitado a alertas y tareas',
};

// Función para obtener la ruta de redirección según el rol
export const getRedirectPath = (role: string | undefined): string => {
  if (!role) return '/dashboard';
  return ROLE_ROUTES[role as UserRole] || '/dashboard';
};

// Función para obtener el nombre legible del rol
export const getRoleName = (role: string | undefined): string => {
  if (!role) return 'Usuario';
  return ROLE_NAMES[role as UserRole] || role;
};

// Función para verificar si un rol tiene acceso a una ruta
export const hasRoleAccess = (role: string | undefined, allowedRoles: string[]): boolean => {
  if (!role) return false;
  return allowedRoles.includes(role);
};