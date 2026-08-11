-- ══════════════════════════════════════════════════════════════
-- TALLERES ENRIQUE — Configuración del sitio (site_settings)
-- Ejecuta este SQL en: Supabase → SQL Editor → New query
-- Basado en las respuestas del cuestionario "Definición de la nueva web"
-- ══════════════════════════════════════════════════════════════

-- 1. TABLA: fila única (id = 1) con todo el contenido editable desde el panel admin
create table if not exists site_settings (
  id                    int primary key default 1,

  -- Contacto
  phone                 text default '942 59 03 01',
  phone_link            text default '+34942590301',
  whatsapp_number       text default '34942590301',
  email                 text default 'mayteruca@hotmail.com',
  address               text default 'C/ Pola Nº 2, Selaya, Cantabria',
  facebook_url          text default 'https://www.facebook.com/p/Talleres-Enrique-100069403444345/',

  -- Horario
  hours_weekday         text default '8:00 – 20:00',
  hours_saturday        text default '9:00 – 14:00',
  hours_sunday          text default 'Cerrado',
  response_time_text    text default 'Te respondemos en horario comercial',

  -- Portada / Hero (objetivo principal: WhatsApp · cliente: profesionales agrícolas y ganaderos de Cantabria)
  hero_title            text default 'Talleres Enrique',
  hero_tagline          text default 'Agrícola · Ganadero · Forestal · Jardín · Ordeño',
  hero_message          text default 'Venta, reparación y recambios para maquinaria agrícola, ganadera, forestal y de jardín',
  hero_image_url        text default null,

  -- Quiénes somos (sección breve en Inicio, no página aparte)
  about_text            text default 'Somos un taller familiar en Selaya, Valle de Pas, con más de 20 años reparando y distribuyendo maquinaria agrícola, ganadera, forestal y de jardín en toda Cantabria. Distribuidores oficiales de la marca Rapid.',

  -- Estadísticas de portada (confirmadas como correctas en el cuestionario)
  stat_years            text default '+20',
  stat_repairs          text default '+500',
  stat_stock            text default '+1.200',

  -- Recogida / reparación fuera del taller (según la avería)
  pickup_policy_text    text default 'Recogida y reparación en la explotación cuando la avería lo requiere. Consúltanos y valoramos la mejor opción.',

  updated_at            timestamptz default now()
);

-- 2. Trigger updated_at
create or replace function update_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_settings_updated_at on site_settings;
create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_settings_updated_at();

-- 3. RLS: lectura pública, escritura anon (igual que el resto de tablas del proyecto)
alter table site_settings enable row level security;

create policy "Lectura pública settings" on site_settings for select using (true);
create policy "Escritura anon settings" on site_settings for all using (true) with check (true);

-- 4. Fila inicial (usa los valores por defecto de arriba)
insert into site_settings (id) values (1)
on conflict (id) do nothing;
