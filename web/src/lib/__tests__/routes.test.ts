import { getAppBasePath, isAdminRoutePath } from '../routes';

describe('routes', () => {
  test('treats /web/admin and /admin as admin routes', () => {
    expect(isAdminRoutePath('/web/admin')).toBe(true);
    expect(isAdminRoutePath('/web/admin/')).toBe(true);
    expect(isAdminRoutePath('/admin')).toBe(true);
  });

  test('does not treat public web paths as admin routes', () => {
    expect(isAdminRoutePath('/web/')).toBe(false);
    expect(isAdminRoutePath('/web/archive')).toBe(false);
    expect(isAdminRoutePath('/web/admin-tools')).toBe(false);
  });

  test('derives the web base path from pathname', () => {
    expect(getAppBasePath('/web/')).toBe('/web/');
    expect(getAppBasePath('/web/admin')).toBe('/web/');
    expect(getAppBasePath('/admin')).toBe('/');
  });
});
