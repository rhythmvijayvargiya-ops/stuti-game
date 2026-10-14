create table if not exists public.scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 40),
  score int not null check (score between 0 and 33),
  time_ms int check (time_ms is null or (time_ms >= 0 and time_ms <= 3600000)),
  played_on text not null,
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;

drop policy if exists "anyone can read scores" on public.scores;
create policy "anyone can read scores"
  on public.scores for select
  to anon, authenticated
  using (true);

drop policy if exists "anyone can add a score" on public.scores;
create policy "anyone can add a score"
  on public.scores for insert
  to anon, authenticated
  with check (true);
