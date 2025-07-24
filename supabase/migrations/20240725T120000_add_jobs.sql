create table public.jobs (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.campaigns on delete cascade,
  lead_json     jsonb not null,                     -- {"email":"x","website":"y", ...}
  status        text not null default 'queued'      -- queued | rendering | done | error
                  check (status in ('queued','rendering','done','error')),
  error_msg     text,
  created_at    timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "jobs read" on public.jobs for select using (true);
create policy "jobs insert" on public.jobs
  for insert with check (auth.role() = 'authenticated');