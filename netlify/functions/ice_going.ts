import { supabase, isAuthorised, unauthorised, json } from './_lib';

export default async (req: Request): Promise<Response> => {
  if (!isAuthorised(req)) return unauthorised();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('ice_going').select('fixture_key');
    if (error) return json({ error: error.message }, 500);
    return json((data ?? []).map((r) => r.fixture_key));
  }

  if (req.method === 'POST') {
    const body = (await req.json()) as { key: string };
    if (!body.key) return json({ error: 'Missing key' }, 400);
    const { error } = await supabase.from('ice_going').upsert({ fixture_key: body.key });
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    if (!key) return json({ error: 'Missing key' }, 400);
    const { error } = await supabase.from('ice_going').delete().eq('fixture_key', key);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};
