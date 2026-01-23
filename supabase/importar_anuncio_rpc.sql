create or replace function public.importar_anuncio(
  p_owner_id uuid,
  p_category_slug text,
  p_title text,
  p_description text,
  p_price numeric,
  p_city text,
  p_state text,
  p_neighborhood text,
  p_images jsonb,
  p_attributes jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_category_id uuid;
  v_listing_id uuid;
begin
  select id into v_category_id
  from public.categories
  where slug = p_category_slug
  limit 1;

  if v_category_id is null then
    raise exception 'Categoria inválida: %', p_category_slug;
  end if;

  insert into public.listings (
    title,
    description,
    price,
    category_id,
    type,
    city,
    state,
    neighborhood,
    status,
    owner_id,
    attributes,
    images
  ) values (
    p_title,
    p_description,
    p_price,
    v_category_id,
    'serviço',
    p_city,
    p_state,
    p_neighborhood,
    'active',
    p_owner_id,
    coalesce(p_attributes, '{}'::jsonb),
    coalesce(p_images, '[]'::jsonb)
  )
  returning id into v_listing_id;

  return v_listing_id;
end;
$$;

revoke all on function public.importar_anuncio(
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text,
  text,
  jsonb,
  jsonb
) from public;

grant execute on function public.importar_anuncio(
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text,
  text,
  jsonb,
  jsonb
) to service_role;
