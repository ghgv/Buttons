// utils/roles.utils.ts
export const getRoleDisplayName = (role: string | undefined): string => {
  if (!role) return 'Usuario';
  
  const roleMap: Record<string, string> = {
    'client_admin': 'Administrador de Clientes',
    'coordinator': 'Coordinador de Sede',
    'super_user': 'Usuario Nubeware',      // ✅ Nuevo rol
    'admin': 'Administrador',
    'user': 'Usuario'
  };
  
  return roleMap[role] || role;
};