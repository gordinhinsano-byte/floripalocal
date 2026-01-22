alter table public.listings enable row level security;

drop policy if exists "Users can update their own listings" on public.listings;

create policy "Users can update their own listings"
  on public.listings
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
