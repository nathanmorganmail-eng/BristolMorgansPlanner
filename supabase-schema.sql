-- Run in Supabase → SQL Editor → New query → paste → Run

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  category text not null check (category in ('All','Mum','Dad','Alice','Delilah','Possible','Interest','Holiday')),
  time text,
  location text,
  link text,
  created_at timestamptz default now()
);

create index if not exists events_date_idx on events(date);

create table if not exists school_holidays (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  label text not null
);

create table if not exists birthdays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  md text not null check (md ~ '^\d{2}-\d{2}$'),
  created_at timestamptz default now()
);

create index if not exists birthdays_md_idx on birthdays(md);

create table if not exists ice_going (
  fixture_key text primary key,
  created_at timestamptz default now()
);

-- RLS on, no public policies. Only the service_role key (used server-side
-- in Netlify Functions) can read/write. The publishable key in the browser
-- can do nothing — all data access goes through /api routes that check
-- the password cookie first.
alter table events enable row level security;
alter table school_holidays enable row level security;
alter table birthdays enable row level security;
alter table ice_going enable row level security;

-- Seed school holidays for 2026 (English term dates)
insert into school_holidays (start_date, end_date, label) values
  ('2026-02-16','2026-02-20','Half Term'),
  ('2026-03-30','2026-04-10','Easter'),
  ('2026-05-25','2026-05-29','Half Term'),
  ('2026-07-20','2026-09-04','Summer'),
  ('2026-10-26','2026-10-30','Half Term'),
  ('2026-12-21','2026-12-31','Christmas');
