describe('adminRuntime', () => {
  const runtime = globalThis as typeof globalThis & { process?: { env?: { NODE_ENV: string | undefined } } };
  const originalNodeEnv = runtime.process?.env?.NODE_ENV;

  afterEach(() => {
    if (runtime.process?.env) {
      runtime.process.env.NODE_ENV = originalNodeEnv;
    }
    jest.resetModules();
  });

  test('enables admin dev bypass in development fallback mode', async () => {
    if (runtime.process?.env) {
      runtime.process.env.NODE_ENV = 'development';
    }
    const { isAdminDevBypassEnabled } = await import('../adminRuntime');

    expect(isAdminDevBypassEnabled()).toBe(true);
  });

  test('disables admin dev bypass outside development without explicit env', async () => {
    if (runtime.process?.env) {
      runtime.process.env.NODE_ENV = 'test';
    }
    const { isAdminDevBypassEnabled, getAdminDevBypassClaims } = await import('../adminRuntime');

    expect(isAdminDevBypassEnabled()).toBe(false);
    expect(getAdminDevBypassClaims()).toEqual({
      sub: 'dev-bypass',
      scopes: ['admin'],
      groups: ['admin'],
    });
  });
});
