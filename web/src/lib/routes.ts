function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function isAdminRoutePath(pathname: string): boolean {
  const normalized = normalizePath(pathname || '/');
  return (
    normalized === '/admin' ||
    normalized === '/web/admin' ||
    normalized.startsWith('/admin/') ||
    normalized.startsWith('/web/admin/')
  );
}

export function getAppBasePath(pathname: string): string {
  const normalized = normalizePath(pathname || '/');
  if (normalized === '/web' || normalized.startsWith('/web/')) {
    return '/web/';
  }
  return '/';
}
