-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- One row per user with all game progress as JSON.
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Each user can only see and change their own row.
drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;

create policy "progress_select_own" on public.progress
  for select to authenticated using (auth.uid() = user_id);
create policy "progress_insert_own" on public.progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.progress from anon;
grant select, insert, update on public.progress to authenticated;
