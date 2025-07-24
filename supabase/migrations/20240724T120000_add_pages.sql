-- Pages belong to a campaign and describe what the viewer sees
create table public.pages (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references public.campaigns on delete cascade,
  position     integer not null,                 -- order in the storyboard
  type         text not null check (type in ('COMPANY', 'STATIC')), -- enum‑like
  payload_json jsonb not null default '{}',      -- holds { "url": "…" } for STATIC
  created_at   timestamptz not null default now()
);

alter table public.pages enable row level security;

-- Anyone can read (front‑end lists); only service role inserts/deletes
create policy "pages read" on public.pages for select using (true);
create policy "pages write" on public.pages
  for insert with check (auth.role() = 'authenticated');
create policy "pages delete" on public.pages
  for delete using (auth.role() = 'authenticated');