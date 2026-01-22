-- ⚠️ ATENÇÃO: RODE ESTE SCRIPT NO "SQL EDITOR" DO SUPABASE ⚠️
-- Ele vai recriar toda a estrutura do banco do ZERO e inserir TODAS as categorias.

-- Habilita extensão para UUIDs
create extension if not exists pgcrypto;

-- ==============================================================================
-- 1. LIMPEZA (Cuidado: apaga dados existentes)
-- ==============================================================================
drop function if exists search_listings;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;
drop table if exists messages cascade;
drop table if exists conversations cascade;
drop table if exists listings cascade;
drop table if exists profiles cascade; -- Nova tabela
drop table if exists attribute_definitions cascade;
drop table if exists categories cascade;

-- ==============================================================================
-- 2. TABELAS (PARTE 1)
-- ==============================================================================

-- 1) categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- 2) profiles (Nova Tabela)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 3) listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric,
  category_id uuid references public.categories(id),
  type text, -- produto | serviço | emprego
  city text,
  state text,
  status text default 'draft', -- draft | active | inactive
  owner_id uuid references public.profiles(id), -- Agora referencia profiles
  attributes jsonb default '{}'::jsonb,
  images jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 4) conversations
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id),
  buyer_id uuid references public.profiles(id),
  seller_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 5) messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id),
  sender_id uuid references public.profiles(id),
  body text,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- ==============================================================================
-- 3. RLS (PARTE 2)
-- ==============================================================================

-- Habilitar RLS em todas as tabelas
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Policies: Categories
create policy "Public categories are viewable by everyone"
  on public.categories for select
  using (true);

-- Policies: Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
  
-- Trigger automático para criar profile ao registrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Policies: Listings
create policy "Public listings are viewable by everyone"
  on public.listings for select
  using (status = 'active');

create policy "Users can see their own draft/inactive listings"
  on public.listings for select
  using (auth.uid() = owner_id);

create policy "Users can insert their own listings"
  on public.listings for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own listings"
  on public.listings for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own listings"
  on public.listings for delete
  using (auth.uid() = owner_id);

-- Policies: Conversations
create policy "Users can see conversations they are part of"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Users can insert conversations they are part of"
  on public.conversations for insert
  with check (auth.uid() = buyer_id);

-- Policies: Messages
create policy "Users can see messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Users can insert messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- ==============================================================================
-- 4. STORAGE (PARTE 3)
-- ==============================================================================

-- Tenta criar o bucket (se falhar, crie manualmente no dashboard como PUBLICO)
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Policies para Storage
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'listing-images' );

drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Auth Update" on storage.objects;
create policy "Auth Update"
  on storage.objects for update
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ==============================================================================
-- 5. RPC SEARCH (PARTE 4)
-- ==============================================================================

create or replace function search_listings(
  p_category_id uuid default null,
  p_city text default null,
  p_price_min numeric default null,
  p_price_max numeric default null,
  p_attrs jsonb default '{}'::jsonb
)
returns setof public.listings
language plpgsql
as $$
declare
  query text;
begin
  return query
  select *
  from public.listings
  where status = 'active'
  and (p_category_id is null or category_id = p_category_id)
  and (p_city is null or city ilike '%' || p_city || '%')
  and (p_price_min is null or price >= p_price_min)
  and (p_price_max is null or price <= p_price_max)
  and (
    p_attrs is null 
    or p_attrs = '{}'::jsonb 
    or attributes @> p_attrs
  )
  order by
    case
      when lower(coalesce(attributes->>'plan_tier', '')) = 'vip'
        and nullif(attributes->>'plan_expires_at', '')::timestamptz > now() then 2
      when lower(coalesce(attributes->>'plan_tier', '')) = 'premium'
        and nullif(attributes->>'plan_expires_at', '')::timestamptz > now() then 1
      else 0
    end desc,
    nullif(attributes->>'plan_expires_at', '')::timestamptz desc nulls last,
    created_at desc;
end;
$$;

-- ==============================================================================
-- 6. DADOS INICIAIS (SEED)
-- ==============================================================================

insert into public.categories (slug, name) values
('alugar-casa-apartamento', 'Alugar casas - Apartamentos'),
('carros-usados', 'Carros usados'),
('vagas-emprego', 'Vagas de emprego'),
('estagios-trainee', 'Estágios - Trainee'),
('curriculos', 'Anunciar currículo - Procurar emprego'),
('cuidador-idosos', 'Acompanhante idosos - Enfermeira'),
('empregada-domestica', 'Empregada doméstica - Diarista'),
('trabalho-em-casa', 'Trabalhar em casa'),
('servicos-domesticos', 'Trabalhos domésticos'),
('babas', 'Babás'),
('servicos-informatica', 'Serviços de informática'),
('cursos-idiomas', 'Cursos de idiomas'),
('animais-estimacao-venda', 'Animais estimação à venda'),
('celulares-acessorios', 'MP3 - Ipod - Celulares'),
('acompanhantes', 'Acompanhantes'),
('motos-scooters', 'Motos - Scooters'),
('caminhoes-comerciais', 'Caminhões - Comerciais'),
('onibus-venda', 'Ônibus usados'),
('barcos-lanchas', 'Barcos - Lanchas'),
('pecas-acessorios', 'Acessórios e serviços'),
('caravanas-trailers', 'Caravanas - Trailers'),
('comprar-imovel', 'Apartamentos - Casas venda'),
('aluguel-temporada', 'Aluguel temporada'),
('lancamentos-imobiliarios', 'Empreendimentos Imóveis'),
('garagens-venda', 'Estacionamentos - Garagens'),
('imoveis-exterior', 'Casas venda exterior'),
('aluguel-temporada-exterior', 'Aluguel temporada exterior'),
('terrenos-exterior', 'Terrenos venda Exterior'),
('pontos-comerciais', 'Imóveis comerciais - Escritórios'),
('terrenos-venda', 'Terrenos - Lotes'),
('aluguel-quarto', 'Quartos - Compartilhar'),
('troca-de-imoveis', 'Troca de casas - Apartamentos'),
('moveis-decoracao', 'Móveis-Camas-Cadeiras'),
('utilidades-domesticas', 'Decoração casa'),
('eletrodomesticos', 'Eletrodomésticos usados'),
('colecionaveis', 'Artigos de coleção'),
('equipamentos-profissionais', 'Equipamentos profissionais'),
('esportes-lazer', 'Artigos esportivos - Bicicletas'),
('artesanato', 'Artesanato - Feito à mão'),
('presentes', 'Idéias para presentes'),
('instrumentos-musicais', 'Instrumentos musicais'),
('gastronomia', 'Bebidas - Comidas'),
('computadores-perifericos', 'Notebooks - Computadores usados'),
('games-livros-filmes', 'DVD - Video Games - Livros - CD'),
('joias-relogios', 'Antiguidades - Jóias'),
('roupas-calcados', 'Roupas e acessórios'),
('beleza-saude', 'Produtos beleza - Saúde'),
('outros-produtos', 'Diversos'),
('turismo', 'Serviços turismo - Agência turismo'),
('traducoes', 'Traduções - Serviços de traduções'),
('mudancas-fretes', 'Mudanças - Frete'),
('profissionais-liberais', 'Profissionais liberais'),
('reformas-manutencao', 'Reparo - Conserto - Reforma'),
('saude-beleza', 'Bem-Estar - Saúde - Beleza'),
('esoterismo', 'Astrologia - Serv. Espirituais'),
('outros-servicos', 'Outros serviços'),
('cursos-informatica', 'Cursos de informática'),
('cursos-profissionalizantes', 'Capacitação profissional'),
('aulas-particulares', 'Professores particulares'),
('esportes-danca', 'Aulas de ginástica'),
('musica-teatro', 'Aulas música-Teatro-Dança'),
('outros-cursos', 'Outros cursos'),
('adocao-animais', 'Adoção animais de estimação'),
('servicos-animais', 'Veterinários-Serviços-Acessórios'),
('acompanhantes-trans', 'Acompanhantes trans'),
('acompanhantes-masculinos', 'Acompanhantes masculinos'),
('amizade', 'Procurar amigos'),
('namoro', 'Procurar amor'),
('mulher-procura-homem', 'Mulher procura homem'),
('homem-procura-mulher', 'Homem procura mulher'),
('mulher-procura-mulher', 'Mullher procura mulher'),
('homem-procura-homem', 'Homem procura homem'),
('encontros', 'Encontros casuais')
on conflict (slug) do nothing;
