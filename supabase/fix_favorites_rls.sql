-- FIX: Favorites RLS Policies
-- Execute this script in your Supabase SQL Editor to fix the "Add but not Remove" issue.

-- 1. Ensure table exists
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, listing_id)
);

-- 2. Enable RLS
alter table public.favorites enable row level security;

-- 3. Drop OLD policies (to ensure clean slate)
drop policy if exists "Users can view own favorites" on public.favorites;
drop policy if exists "Users can add favorites" on public.favorites;
drop policy if exists "Users can remove own favorites" on public.favorites;
drop policy if exists "favorites_select_policy" on public.favorites;
drop policy if exists "favorites_insert_policy" on public.favorites;
drop policy if exists "favorites_delete_policy" on public.favorites;
drop policy if exists "Enable read access for own favorites" on public.favorites;
drop policy if exists "Enable insert for own favorites" on public.favorites;
drop policy if exists "Enable delete for own favorites" on public.favorites;

-- 4. Create NEW correct policies
-- Allow viewing own favorites
create policy "favorites_select_policy" on public.favorites
  for select to authenticated
  using (auth.uid() = user_id);

-- Allow adding favorites
create policy "favorites_insert_policy" on public.favorites
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Allow removing favorites (Critical Fix)
create policy "favorites_delete_policy" on public.favorites
  for delete to authenticated
  using (auth.uid() = user_id);
