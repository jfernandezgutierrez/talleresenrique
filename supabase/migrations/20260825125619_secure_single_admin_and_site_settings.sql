create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon;
revoke insert, update, delete, truncate, references, trigger on public.admin_users from authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "Administrador consulta su acceso" on public.admin_users;
create policy "Administrador consulta su acceso" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text default '942 59 03 01',
  phone_link text default '+34942590301',
  whatsapp_number text default '34942590301',
  email text default 'mayteruca@hotmail.com',
  address text default 'C/ Pola Nº 2, Selaya, Cantabria',
  facebook_url text default 'https://www.facebook.com/p/Talleres-Enrique-100069403444345/',
  hours_weekday text default '8:00 – 20:00',
  hours_saturday text default '9:00 – 14:00',
  hours_sunday text default 'Cerrado',
  response_time_text text default 'Te respondemos en horario comercial',
  hero_title text default 'Talleres Enrique',
  hero_tagline text default 'Agrícola · Ganadero · Forestal · Jardín · Ordeño',
  hero_message text default 'Venta, reparación y recambios para maquinaria agrícola, ganadera, forestal y de jardín',
  hero_image_url text,
  about_text text default 'Somos un taller familiar en Selaya, Valle de Pas, con más de 20 años reparando y distribuyendo maquinaria agrícola, ganadera, forestal y de jardín en toda Cantabria. Distribuidores oficiales de la marca Rapid.',
  stat_years text default '+20',
  stat_repairs text default '+500',
  stat_stock text default '+1.200',
  pickup_policy_text text default 'Recogida y reparación en la explotación cuando la avería lo requiere. Consúltanos y valoramos la mejor opción.',
  updated_at timestamptz default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create or replace function public.update_settings_updated_at()
returns trigger language plpgsql set search_path = pg_catalog, public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.update_settings_updated_at();

alter function public.update_updated_at() set search_path = pg_catalog, public;
create index if not exists idx_parts_category on public.parts(category);

alter table public.categories enable row level security;
alter table public.parts enable row level security;
alter table public.part_media enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Escritura anon categorías" on public.categories;
drop policy if exists "Lectura pública categorías" on public.categories;
drop policy if exists "Escritura anon piezas" on public.parts;
drop policy if exists "Lectura pública piezas" on public.parts;
drop policy if exists "Escritura anon media" on public.part_media;
drop policy if exists "Lectura pública media" on public.part_media;
drop policy if exists "Escritura anon settings" on public.site_settings;
drop policy if exists "Lectura pública settings" on public.site_settings;

create policy "Lectura pública categorías" on public.categories for select to anon, authenticated using (true);
create policy "Admin inserta categorías" on public.categories for insert to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin actualiza categorías" on public.categories for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin elimina categorías" on public.categories for delete to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create policy "Lectura pública piezas" on public.parts for select to anon, authenticated using (true);
create policy "Admin inserta piezas" on public.parts for insert to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin actualiza piezas" on public.parts for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin elimina piezas" on public.parts for delete to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create policy "Lectura pública media" on public.part_media for select to anon, authenticated using (true);
create policy "Admin inserta media" on public.part_media for insert to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin actualiza media" on public.part_media for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin elimina media" on public.part_media for delete to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create policy "Lectura pública settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admin inserta settings" on public.site_settings for insert to authenticated
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin actualiza settings" on public.site_settings for update to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

revoke insert, update, delete, truncate, references, trigger
  on public.categories, public.parts, public.part_media, public.site_settings from anon;
grant select on public.categories, public.parts, public.part_media, public.site_settings to anon;
grant select, insert, update, delete
  on public.categories, public.parts, public.part_media, public.site_settings to authenticated;
grant usage, select on sequence public.parts_id_seq, public.part_media_id_seq to authenticated;

drop policy if exists "Imágenes públicas" on storage.objects;
drop policy if exists "Subida anon" on storage.objects;
drop policy if exists "Borrado anon" on storage.objects;
drop policy if exists "Vídeos públicos" on storage.objects;
drop policy if exists "Subida vídeos anon" on storage.objects;
drop policy if exists "Borrado vídeos anon" on storage.objects;

create policy "Media pública" on storage.objects for select to anon, authenticated
  using (bucket_id in ('parts-images', 'parts-videos'));
create policy "Admin sube media" on storage.objects for insert to authenticated
  with check (bucket_id in ('parts-images', 'parts-videos')
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin actualiza media storage" on storage.objects for update to authenticated
  using (bucket_id in ('parts-images', 'parts-videos')
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (bucket_id in ('parts-images', 'parts-videos')
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin elimina media storage" on storage.objects for delete to authenticated
  using (bucket_id in ('parts-images', 'parts-videos')
    and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

update storage.buckets set file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id = 'parts-images';
update storage.buckets set file_size_limit = 104857600,
  allowed_mime_types = array['video/mp4','video/webm','video/quicktime']
where id = 'parts-videos';
