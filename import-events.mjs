// One-shot import of events parsed from Weekends 2026.xlsx.
// Run: node import-events.mjs
// Reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local.

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i), l.slice(i + 1)];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const events = JSON.parse(readFileSync('events-to-import.json', 'utf8'));

const { data: existing } = await supabase.from('events').select('date,title');
const existingSet = new Set((existing ?? []).map((e) => `${e.date}|${e.title}`));

const toInsert = events.filter((e) => !existingSet.has(`${e.date}|${e.title}`));
console.log(`Existing: ${existing?.length ?? 0}, importing ${toInsert.length} new events…`);

if (toInsert.length) {
  const { error } = await supabase.from('events').insert(toInsert);
  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
console.log('Done.');
