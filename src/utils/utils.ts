export function haveAccess(
  requiredRole: string[],
  userRoles: string[]
): boolean {
  if (userRoles.length === 0) return false;
  return requiredRole.some((role) => userRoles.includes(role));
}
