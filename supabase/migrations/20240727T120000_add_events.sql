create table public.events (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.jobs on delete cascade,
  event_type  text not null check (event_type in ('open','play','finish')),
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;
create policy "events insert" on public.events
  for insert with check (auth.role() = 'authenticated');
create policy "events read" on public.events for select using (true);