-- Run in Supabase SQL Editor (one time)

create table if not exists public.enquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz default now() not null,
  name text not null,
  phone text not null,
  course text not null,
  message text,
  source text default 'website',
  page_url text
);

alter table public.enquiries enable row level security;

-- Allow website form to insert only (anon key)
create policy "Allow public insert"
  on public.enquiries
  for insert
  to anon
  with check (true);

-- Do NOT allow public read (view data in Supabase dashboard only)
