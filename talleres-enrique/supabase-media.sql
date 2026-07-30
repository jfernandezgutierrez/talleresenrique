-- ══════════════════════════════════════════════════════════════
-- TALLERES ENRIQUE — Añadir soporte de media múltiple
-- Ejecuta este SQL en: Supabase → SQL Editor → New query
-- ══════════════════════════════════════════════════════════════

-- 1. Tabla de media (imágenes y vídeos por pieza)
create table if not exists part_media (
  id          bigserial primary key,
  part_id     bigint not null references parts(id) on delete cascade,
  url         text not null,
  type        text not null default 'image' check (type in ('image', 'video')),
  is_primary  boolean default false,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- Índice para consultas por pieza
create index if not exists idx_part_media_part_id on part_media(part_id);

-- RLS
alter table part_media enable row level security;
create policy "Lectura pública media"  on part_media for select using (true);
create policy "Escritura anon media"   on part_media for all using (true) with check (true);

-- 2. Función helper: obtener media de una pieza ordenada
-- (La usaremos en las queries de la app)

-- 3. Política storage para vídeos subidos directamente
insert into storage.buckets (id, name, public)
values ('parts-videos', 'parts-videos', true)
on conflict (id) do nothing;

create policy "Vídeos públicos"
  on storage.objects for select
  using (bucket_id = 'parts-videos');

create policy "Subida vídeos anon"
  on storage.objects for insert
  with check (bucket_id = 'parts-videos');

create policy "Borrado vídeos anon"
  on storage.objects for delete
  using (bucket_id = 'parts-videos');
