create extension if not exists "pgcrypto";

create table public.campaigns (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  master_video_url text,
  created_at    timestamptz not null default now()
);

alter table public.campaigns enable row level security;
create policy "public read" on public.campaigns
  for select using (true);
create policy "authenticated insert" on public.campaigns
  for insert with check (auth.role() = 'authenticated');