import { readViteEnv } from './adminRuntime';

type AdminSession = {
  accessToken: string;
  idToken?: string;
  tokenType: string;
  expiresAtMs: number;
};

type CallbackResult =
  | { status: 'success' }
  | { status: 'idle' }
  | { status: 'error'; message: string };

const SESSION_KEY = 'diopside.admin.auth.session';
const PKCE_KEY = 'diopside.admin.auth.pkce';

function getConfig() {
  const domain = (readViteEnv('VITE_COGNITO_DOMAIN') || '').trim().replace(/\/$/, '');
  const clientId = (readViteEnv('VITE_COGNITO_CLIENT_ID') || '').trim();
  const redirectUri = (readViteEnv('VITE_COGNITO_REDIRECT_URI') || '').trim();
  const logoutUri = (readViteEnv('VITE_COGNITO_LOGOUT_URI') || '').trim();
  const scopes = (readViteEnv('VITE_COGNITO_SCOPES') || 'openid profile email').trim();
  return { domain, clientId, redirectUri, logoutUri, scopes };
}

function randomString(size: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const arr = new Uint8Array(size);
  crypto.getRandomValues(arr);
  let out = '';
  for (let i = 0; i < arr.length; i += 1) {
    out += alphabet[arr[i]! % alphabet.length];
  }
  return out;
}

function base64Url(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  let str = '';
  for (let i = 0; i < bytes.length; i += 1) {
    str += String.fromCharCode(bytes[i]!);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function toChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(digest);
}

function saveSession(session: AdminSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession(): AdminSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.accessToken || typeof parsed.expiresAtMs !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function exchangeCode(code: string, verifier: string): Promise<AdminSession> {
  const { domain, clientId, redirectUri } = getConfig();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const res = await fetch(`${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status})`);
  }

  const token = (await res.json()) as {
    access_token: string;
    id_token?: string;
    token_type?: string;
    expires_in?: number;
  };

  if (!token.access_token) {
    throw new Error('access_token is missing');
  }

  return {
    accessToken: token.access_token,
    ...(token.id_token != null ? { idToken: token.id_token } : {}),
    tokenType: token.token_type ?? 'Bearer',
    expiresAtMs: Date.now() + Math.max(60, token.expires_in ?? 3600) * 1000,
  };
}

export function isAdminAuthConfigured(): boolean {
  const { domain, clientId, redirectUri } = getConfig();
  return Boolean(domain && clientId && redirectUri);
}

export function getAdminAccessToken(): string | null {
  const session = loadSession();
  if (!session) return null;
  if (Date.now() >= session.expiresAtMs - 30_000) {
    clearSession();
    return null;
  }
  return session.accessToken;
}

export function parseAdminClaims(): { sub: string | null; scopes: string[]; groups: string[] } {
  const token = getAdminAccessToken();
  if (!token) return { sub: null, scopes: [], groups: [] };

  try {
    const payload = token.split('.')[1];
    if (!payload) return { sub: null, scopes: [], groups: [] };
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4;
    const padded = normalized + (pad === 0 ? '' : '='.repeat(4 - pad));
    const decoded = JSON.parse(atob(padded)) as {
      sub?: string;
      scope?: string;
      'cognito:groups'?: string[];
    };
    return {
      sub: decoded.sub ?? null,
      scopes: decoded.scope ? decoded.scope.split(/\s+/).filter(Boolean) : [],
      groups: Array.isArray(decoded['cognito:groups']) ? decoded['cognito:groups'] : [],
    };
  } catch {
    return { sub: null, scopes: [], groups: [] };
  }
}

export async function startAdminLogin(): Promise<void> {
  const { domain, clientId, redirectUri, scopes } = getConfig();
  if (!domain || !clientId || !redirectUri) {
    throw new Error('Cognito configuration is incomplete');
  }

  const state = randomString(48);
  const verifier = randomString(64);
  const challenge = await toChallenge(verifier);

  sessionStorage.setItem(PKCE_KEY, JSON.stringify({ state, verifier }));

  const url = new URL(`${domain}/oauth2/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scopes);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('code_challenge', challenge);

  window.location.assign(url.toString());
}

export async function handleAdminAuthCallback(): Promise<CallbackResult> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');
  const errorDescription = params.get('error_description');

  if (error) {
    return { status: 'error', message: `${error}${errorDescription ? `: ${errorDescription}` : ''}` };
  }

  if (!code && !state) {
    return { status: 'idle' };
  }

  const raw = sessionStorage.getItem(PKCE_KEY);
  sessionStorage.removeItem(PKCE_KEY);

  if (!raw || !code || !state) {
    return { status: 'error', message: 'Invalid auth callback state' };
  }

  try {
    const parsed = JSON.parse(raw) as { state?: string; verifier?: string };
    if (!parsed.state || !parsed.verifier || parsed.state !== state) {
      return { status: 'error', message: 'State verification failed' };
    }

    const session = await exchangeCode(code, parsed.verifier);
    saveSession(session);
    window.history.replaceState({}, document.title, window.location.pathname);
    return { status: 'success' };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : String(e) };
  }
}

export function logoutAdmin(): void {
  const { domain, clientId, logoutUri } = getConfig();
  clearSession();
  if (!domain || !clientId || !logoutUri) return;

  const url = new URL(`${domain}/logout`);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('logout_uri', logoutUri);
  window.location.assign(url.toString());
}
