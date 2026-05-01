import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } }
);

const COOKIE_NAME = 'wk_auth';

export function isAuthorised(req: Request): boolean {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(/wk_auth=([^;]+)/);
  if (!match) return false;
  return match[1] === expectedToken();
}

export function expectedToken(): string {
  // Simple deterministic token from password — not signed, but that's fine
  // because the only way to get it is to know the password (which we check).
  // Anyone with the cookie value can impersonate; that's the same as anyone
  // with the password — acceptable for a single-shared-password model.
  return Buffer.from(process.env.SITE_PASSWORD ?? '').toString('base64');
}

export function authCookie(): string {
  return `${COOKIE_NAME}=${expectedToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`;
}

export function unauthorised(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorised' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
