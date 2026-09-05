import { supabase, isAuthorised, unauthorised, json } from './_lib';

export default async (req: Request): Promise<Response> => {
  if (!isAuthorised(req)) return unauthorised();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('birthdays').select('*').order('md');
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  if (req.method === 'POST') {
    const body = (await req.json()) as { name: string; md: string };
    if (!body.name || !/^\d{2}-\d{2}$/.test(body.md ?? '')) {
      return json({ error: 'Need name and md as MM-DD' }, 400);
    }
    const { data, error } = await supabase
      .from('birthdays')
      .insert({ name: body.name.trim(), md: body.md })
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json(data, 201);
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'Missing id' }, 400);
    const { error } = await supabase.from('birthdays').delete().eq('id', id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};
