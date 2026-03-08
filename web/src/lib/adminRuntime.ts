const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);
type RuntimeProcess = typeof globalThis & { process?: { env?: { NODE_ENV?: string } } };

export function readViteEnv(key: string): string | undefined {
  try {
    return Function('k', 'try { return import.meta.env?.[k]; } catch { return undefined; }')(key) as string | undefined;
  } catch {
    return undefined;
  }
}

function parseOptionalBoolean(value: string | undefined): boolean | null {
  if (value == null) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return TRUE_VALUES.has(normalized);
}

function isViteDevMode(): boolean {
  try {
    return Boolean(Function('try { return import.meta.env?.DEV; } catch { return false; }')() as boolean | undefined);
  } catch {
    const runtime = globalThis as RuntimeProcess;
    return runtime.process?.env?.NODE_ENV === 'development';
  }
}

export function isAdminDevBypassEnabled(): boolean {
  const explicit = parseOptionalBoolean(readViteEnv('VITE_ADMIN_DEV_BYPASS'));
  if (explicit != null) {
    return explicit;
  }
  return isViteDevMode();
}

export function getAdminDevBypassClaims(): { sub: string; scopes: string[]; groups: string[] } {
  return {
    sub: 'dev-bypass',
    scopes: ['admin'],
    groups: ['admin'],
  };
}
