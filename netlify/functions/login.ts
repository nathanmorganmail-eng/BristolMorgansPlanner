import { authCookie, json } from './_lib';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const { password } = (await req.json()) as { password?: string };
  if (!password || password !== process.env.SITE_PASSWORD) {
    return json({ error: 'Wrong password' }, 401);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': authCookie(),
    },
  });
};
