-- Supabase schema for classifieds + dynamic filters
-- Paste this in: Supabase Dashboard -> SQL Editor -> New query

-- Extensions
create extension if not exists pgcrypto;

-- 1) Categories (slugs match your frontend routes)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  group_name text,
  kind text not null default 'produto',
  created_at timestamptz not null default now()
);

-- 2) Attribute definitions (drives the filter UI)
-- config example:
-- {"type":"range","key":"price","subfilters":{"min":["0","100"],"max":["200","Ilimitado"]}}
create table if not exists public.attribute_definitions (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references public.categories(slug) on delete cascade,
  key text not null,
  label text not null,
  ui text not null, -- select | range | checkbox
  value_type text not null, -- text | number | boolean
  config jsonb not null default '{}'::jsonb,
  filterable boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category_slug, key)
);

-- 3) Listings (ads)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric,
  category_slug text not null references public.categories(slug) on delete restrict,
  location_state text,
  location_city text,
  images text[] not null default '{}',
  video text,
  user_id uuid,
  status text not null default 'active',
  is_premium boolean not null default false,
  is_verified boolean not null default false,
  views integer not null default 0,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_category_idx on public.listings (category_slug);
create index if not exists listings_state_idx on public.listings (location_state);
create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists listings_price_idx on public.listings (price);
create index if not exists listings_attr_gin_idx on public.listings using gin (attributes jsonb_path_ops);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_listings_updated_at on public.listings;
create trigger trg_listings_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

-- 4) Search function (filters + ordering + pagination)
-- p_filters expects URLSearchParams-like keys (e.g. {"price_min":"1000","brand":"Fiat"})
create or replace function public.search_listings(
  p_category_slug text default null,
  p_state text default null,
  p_query text default null,
  p_filters jsonb default '{}'::jsonb,
  p_sort text default 'recent', -- recent | price_asc | price_desc
  p_limit integer default 50,
  p_offset integer default 0
)
returns setof public.listings
language plpgsql
as $$
declare
  k text;
  v text;
  sql text := 'select * from public.listings where status = ''active''';
begin
  if p_category_slug is not null and length(trim(p_category_slug)) > 0 then
    sql := sql || ' and category_slug = $1';
  else
    sql := sql || ' and true';
  end if;

  if p_state is not null and length(trim(p_state)) > 0 and p_state <> 'TODO BRASIL' then
    sql := sql || ' and location_state = $2';
  else
    sql := sql || ' and true';
  end if;

  if p_query is not null and length(trim(p_query)) > 0 then
    sql := sql || ' and (title ilike $3 or description ilike $3)';
  else
    sql := sql || ' and true';
  end if;

  -- dynamic filters (price + jsonb attributes)
  for k, v in select key, value from jsonb_each_text(coalesce(p_filters, '{}'::jsonb)) loop
    if v is null or length(trim(v)) = 0 then
      continue;
    end if;

    -- range min/max convention: <key>_min and <key>_max
    if k like '%_min' then
      if replace(k, '_min', '') = 'price' then
        sql := sql || format(' and price >= %L', nullif(replace(v, '.', ''), '')::numeric);
      else
        sql := sql || format(' and (attributes ->> %L) is not null and (attributes ->> %L)::numeric >= %L', replace(k, '_min', ''), replace(k, '_min', ''), nullif(replace(v, '.', ''), '')::numeric);
      end if;
    elsif k like '%_max' then
      if lower(v) = 'ilimitado' then
        continue;
      end if;
      if replace(k, '_max', '') = 'price' then
        sql := sql || format(' and price <= %L', nullif(replace(v, '.', ''), '')::numeric);
      else
        sql := sql || format(' and (attributes ->> %L) is not null and (attributes ->> %L)::numeric <= %L', replace(k, '_max', ''), replace(k, '_max', ''), nullif(replace(v, '.', ''), '')::numeric);
      end if;
    else
      -- checkbox conventions: key=true
      if v = 'true' then
        sql := sql || format(' and (coalesce(attributes ->> %L, ''false'')) = ''true''', k);
      else
        sql := sql || format(' and (attributes ->> %L) = %L', k, v);
      end if;
    end if;
  end loop;

  -- ordering
  if p_sort = 'price_asc' then
    sql := sql || ' order by price asc nulls last, created_at desc';
  elsif p_sort = 'price_desc' then
    sql := sql || ' order by price desc nulls last, created_at desc';
  else
    sql := sql || ' order by created_at desc';
  end if;

  sql := sql || format(' limit %s offset %s', greatest(1, least(p_limit, 200)), greatest(p_offset, 0));

  return query execute sql using p_category_slug, p_state, case when p_query is not null and length(trim(p_query))>0 then ('%'||p_query||'%') else null end;
end;
$$;

-- RLS
alter table public.categories enable row level security;
alter table public.attribute_definitions enable row level security;
alter table public.listings enable row level security;

-- Public read for categories/filters/listings
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
for select using (true);

drop policy if exists "public read attribute_definitions" on public.attribute_definitions;
create policy "public read attribute_definitions" on public.attribute_definitions
for select using (true);

drop policy if exists "public read listings" on public.listings;
create policy "public read listings" on public.listings
for select using (status = 'active');

-- Authenticated write for listings (owner-based)
drop policy if exists "auth insert listings" on public.listings;
create policy "auth insert listings" on public.listings
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "auth update own listings" on public.listings;
create policy "auth update own listings" on public.listings
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Service role can do everything by default (used only in scripts)
