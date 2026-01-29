import { decodeJwt } from '@/lib/auth/jwt';

export type AuthTokens = { accessToken: string; refreshToken: string };

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

const STORAGE_KEY = 'scentiment-auth';

function getApiBaseUrl(): string {
  const env = import.meta.env as Record<string, string | undefined>;
  const raw = (env.VITE_API_BASE_URL ?? '').trim();
  if (!raw) {
    return import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1';
  }

  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  const withScheme =
    withoutTrailingSlash.startsWith('http://') || withoutTrailingSlash.startsWith('https://')
      ? withoutTrailingSlash
      : withoutTrailingSlash.startsWith('/')
        ? withoutTrailingSlash
        : `https://${withoutTrailingSlash}`;
  const base = withScheme.replace(/\/+$/, '');
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

export function loadAuthSession(): { tokens: AuthTokens; user: AuthUser } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { tokens: AuthTokens; user: AuthUser };
  } catch {
    return null;
  }
}

export function saveAuthSession(tokens: AuthTokens): { tokens: AuthTokens; user: AuthUser } {
  const payload = decodeJwt(tokens.accessToken);
  const user: AuthUser = {
    id: String(payload?.sub ?? ''),
    email: String(payload?.email ?? ''),
    role: String(payload?.role ?? 'user'),
  };
  const session = { tokens, user };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function signupEmailPassword(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ tokens: AuthTokens; user: AuthUser }> {
  const tokens = await postJson<AuthTokens>('/auth/signup', input);
  return saveAuthSession(tokens);
}

export async function loginEmailPassword(input: {
  email: string;
  password: string;
}): Promise<{ tokens: AuthTokens; user: AuthUser }> {
  const tokens = await postJson<AuthTokens>('/auth/login', input);
  return saveAuthSession(tokens);
}

