import { supabase, isAuthorised, unauthorised, json } from './_lib';

export default async (req: Request): Promise<Response> => {
  if (!isAuthorised(req)) return unauthorised();
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const { data, error } = await supabase
    .from('school_holidays')
    .select('*')
    .order('start_date');
  if (error) return json({ error: error.message }, 500);
  return json(data);
};
