import { supabase, isAuthorised, unauthorised, json } from './_lib';

export default async (req: Request): Promise<Response> => {
  if (!isAuthorised(req)) return unauthorised();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('events').select('*').order('date');
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  if (req.method === 'POST') {
    const body = (await req.json()) as {
      date: string;
      endDate?: string | null;
      title: string;
      category: string;
      time?: string | null;
      location?: string | null;
      link?: string | null;
    };
    const { data, error } = await supabase
      .from('events')
      .insert({
        date: body.date,
        end_date: body.endDate ?? null,
        title: body.title,
        category: body.category,
        time: body.time ?? null,
        location: body.location ?? null,
        link: body.link ?? null,
      })
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json(data, 201);
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'Missing id' }, 400);
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};
