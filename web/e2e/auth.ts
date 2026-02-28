import { importJWK, SignJWT } from 'jose';

const kid = 'e2e-test-key-1';

let cachedToken: string | null = null;

function loadPrivateJwk() {
  const raw = process.env.PW_E2E_PRIVATE_JWK;
  if (!raw) {
    throw new Error('PW_E2E_PRIVATE_JWK is required for E2E JWT generation');
  }
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  if (parsed.kty !== 'RSA' || typeof parsed.d !== 'string') {
    throw new Error('PW_E2E_PRIVATE_JWK must be an RSA private JWK JSON string');
  }
  return parsed;
}

export async function getE2EAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const privateJwk = loadPrivateJwk();
  const key = await importJWK(privateJwk, 'RS256');
  const issuer = process.env.PW_E2E_ISSUER || 'http://api:3000/e2e-issuer';
  const audience = process.env.PW_E2E_AUDIENCE || 'diopside-e2e';

  cachedToken = await new SignJWT({ scope: 'e2e:test' })
    .setProtectedHeader({ alg: 'RS256', kid })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject('e2e-tester')
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(key);

  return cachedToken;
}
