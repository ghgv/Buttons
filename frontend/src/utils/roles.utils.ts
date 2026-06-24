// utils/roles.utils.ts
export const getRoleDisplayName = (role: string | undefined): string => {
  if (!role) return 'Usuario';
  
  const roleMap: Record<string, string> = {
    'client_admin': 'Administrador',
    'coordinator': 'Coordinador de Sede',
    'admin': 'Administrador',
    'user': 'Usuario'
  };
  
  return roleMap[role] || role;
};