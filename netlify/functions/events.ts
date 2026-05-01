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
      title: string;
      category: string;
      time?: string | null;
      location?: string | null;
    };
    const { data, error } = await supabase
      .from('events')
      .insert({
        date: body.date,
        title: body.title,
        category: body.category,
        time: body.time ?? null,
        location: body.location ?? null,
      })
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json(data, 201);
  }

  return json({ error: 'Method not allowed' }, 405);
};
