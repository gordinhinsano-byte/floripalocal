-- 1. Create the favorites table if it doesn't exist
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, listing_id)
);

-- 2. Force Schema Cache Reload (Helps with "Could not find table in schema cache" error)
NOTIFY pgrst, 'reload schema';

-- 3. Enable Security (RLS)
alter table public.favorites enable row level security;

-- 4. Clean up old policies to avoid conflicts
drop policy if exists "favorites_select_policy" on public.favorites;
drop policy if exists "favorites_insert_policy" on public.favorites;
drop policy if exists "favorites_delete_policy" on public.favorites;

-- 5. Create Policies
-- View: User can see their own favorites
create policy "favorites_select_policy" on public.favorites
  for select to authenticated
  using (auth.uid() = user_id);

-- Insert: User can add a favorite
create policy "favorites_insert_policy" on public.favorites
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Delete: User can remove a favorite
create policy "favorites_delete_policy" on public.favorites
  for delete to authenticated
  using (auth.uid() = user_id);
