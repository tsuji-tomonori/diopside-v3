describe('adminApi auth handling', () => {
  const runtime = globalThis as typeof globalThis & { process?: { env?: { NODE_ENV: string | undefined } }; fetch?: typeof fetch };
  const originalNodeEnv = runtime.process?.env?.NODE_ENV;
  const originalFetch = runtime.fetch;

  afterEach(() => {
    if (runtime.process?.env) {
      runtime.process.env.NODE_ENV = originalNodeEnv;
    }
    runtime.fetch = originalFetch;
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('allows admin API requests without a token in development bypass mode', async () => {
    if (runtime.process?.env) {
      runtime.process.env.NODE_ENV = 'development';
    }
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        checks: {
          data_freshness: 'ok',
          tag_master_consistency: 'ok',
          archive_page_completeness: 'ok',
          distribution_availability: 'ok',
        },
      }),
    });
    runtime.fetch = fetchMock as typeof fetch;

    const { adminApi } = await import('../adminApi');

    await expect(adminApi.getDiagnosticsHealth()).resolves.toEqual({
      status: 'ok',
      checks: {
        dataFreshness: 'ok',
        tagMasterConsistency: 'ok',
        archivePageCompleteness: 'ok',
        distributionAvailability: 'ok',
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new Headers(init.headers).get('authorization')).toBeNull();
  });

  test('requires a token outside development bypass mode', async () => {
    if (runtime.process?.env) {
      runtime.process.env.NODE_ENV = 'test';
    }
    const { adminApi } = await import('../adminApi');

    await expect(adminApi.getDiagnosticsHealth()).rejects.toThrow('ADMIN_AUTH_REQUIRED');
  });
});
