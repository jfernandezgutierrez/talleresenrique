-- ══════════════════════════════════════════════════════════════
-- TALLERES ENRIQUE — Supabase Setup
-- Ejecuta este SQL en: Supabase → SQL Editor → New query
-- ══════════════════════════════════════════════════════════════

-- 1. TABLA DE CATEGORÍAS
create table if not exists categories (
  id         text primary key default gen_random_uuid()::text,
  name       text not null unique,
  icon       text not null default '📦',
  color      text not null default '#3182ce',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 2. TABLA DE PIEZAS
create table if not exists parts (
  id           bigserial primary key,
  name         text not null,
  ref          text default '',
  category     text not null references categories(name) on update cascade,
  cat_color    text default '#777',
  emoji        text default '🔧',
  compat       text default '',
  description  text default '',
  stock_status text default 'available' check (stock_status in ('available','low','out')),
  stock_label  text default 'Disponible',
  image_url    text default null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 3. TRIGGER para actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger parts_updated_at
  before update on parts
  for each row execute function update_updated_at();

-- 4. ROW LEVEL SECURITY — lectura pública, escritura solo autenticada
alter table categories enable row level security;
alter table parts       enable row level security;

-- Cualquiera puede leer
create policy "Lectura pública categorías" on categories for select using (true);
create policy "Lectura pública piezas"     on parts       for select using (true);

-- Solo anon key puede escribir (el panel admin usa la anon key con rol de servicio en este caso)
-- Para simplificar permitimos escritura con anon key (la contraseña del admin protege el panel)
create policy "Escritura anon categorías" on categories for all using (true) with check (true);
create policy "Escritura anon piezas"     on parts       for all using (true) with check (true);

-- 5. STORAGE BUCKET para fotos
insert into storage.buckets (id, name, public)
values ('parts-images', 'parts-images', true)
on conflict (id) do nothing;

-- Política de storage: lectura pública
create policy "Imágenes públicas"
  on storage.objects for select
  using (bucket_id = 'parts-images');

-- Política de storage: subida desde anon
create policy "Subida anon"
  on storage.objects for insert
  with check (bucket_id = 'parts-images');

-- Política de storage: borrado desde anon
create policy "Borrado anon"
  on storage.objects for delete
  using (bucket_id = 'parts-images');

-- 6. DATOS INICIALES — Categorías
insert into categories (id, name, icon, color, sort_order) values
  ('cat-1', 'Motor',       '🔩', '#e53e3e', 1),
  ('cat-2', 'Hidráulica',  '🔵', '#3182ce', 2),
  ('cat-3', 'Transmisión', '⚙️', '#805ad5', 3),
  ('cat-4', 'Eléctrico',   '⚡', '#d69e2e', 4),
  ('cat-5', 'Carrocería',  '🛡️', '#38a169', 5),
  ('cat-6', 'Jardín',      '🌿', '#2f855a', 6),
  ('cat-7', 'Forestal',    '🌲', '#276749', 7),
  ('cat-8', 'Aperos',      '🏗️', '#744210', 8)
on conflict (id) do nothing;

-- 7. DATOS INICIALES — Piezas (catálogo base)
insert into parts (name, ref, category, cat_color, emoji, compat, stock_status, stock_label) values
  ('Filtro de aceite motor',           'MOT-001', 'Motor',       '#e53e3e', '🔩', 'John Deere 5000–7000, Fendt 300–700',   'available', 'Disponible'),
  ('Junta de culata completa',         'MOT-002', 'Motor',       '#e53e3e', '⚙️', 'Case IH MXM, New Holland T6000',        'available', 'Disponible'),
  ('Bomba de inyección Bosch',         'MOT-003', 'Motor',       '#e53e3e', '💉', 'Universal Diesels 4 cil.',              'low',       'Pocas unidades'),
  ('Bomba de agua (refrigeración)',    'MOT-004', 'Motor',       '#e53e3e', '💧', 'Massey Ferguson 4200–6400',             'available', 'Disponible'),
  ('Termostato 82°C',                  'MOT-005', 'Motor',       '#e53e3e', '🌡️','John Deere, Fendt, Case',               'available', 'Disponible'),
  ('Inyectores Bosch (kit 4)',         'MOT-006', 'Motor',       '#e53e3e', '🔌', 'Fendt 500–800 Vario',                   'out',       'Sin stock'),
  ('Correa distribución + tensores',  'MOT-007', 'Motor',       '#e53e3e', '🔧', 'New Holland T5, T6, T7',                'available', 'Disponible'),
  ('Filtro combustible doble efecto', 'MOT-008', 'Motor',       '#e53e3e', '🛢️','Universal tractores diesel',             'available', 'Disponible'),
  ('Cilindro hidráulico doble efecto','HID-001', 'Hidráulica',  '#3182ce', '🔵', 'Remolques y equipos varios',            'available', 'Disponible'),
  ('Bomba hidráulica de engranajes',  'HID-002', 'Hidráulica',  '#3182ce', '⚙️', 'John Deere 6030–6130, Case',           'available', 'Disponible'),
  ('Válvula de control proporcional', 'HID-003', 'Hidráulica',  '#3182ce', '🔩', 'Manitou, JCB Telehandler',             'low',       'Pocas unidades'),
  ('Mangueras alta presión (par)',    'HID-004', 'Hidráulica',  '#3182ce', '🌊', 'Universal',                             'available', 'Disponible'),
  ('Filtro de aceite hidráulico',     'HID-005', 'Hidráulica',  '#3182ce', '💠', 'Universal tractores',                  'available', 'Disponible'),
  ('Sello/retén bomba hidráulica',    'HID-006', 'Hidráulica',  '#3182ce', '🔷', 'Massey Ferguson, Same, Lamborghini',   'available', 'Disponible'),
  ('Disco de embrague tractor',       'TRA-001', 'Transmisión', '#805ad5', '🟣', 'Massey Ferguson 5400–7400',            'available', 'Disponible'),
  ('Kit embrague completo',           'TRA-002', 'Transmisión', '#805ad5', '🔧', 'New Holland T5000–T7000',              'low',       'Pocas unidades'),
  ('Diferencial trasero completo',    'TRA-003', 'Transmisión', '#805ad5', '🛞', 'John Deere 5000 Serie',                'out',       'Consultar'),
  ('Cardán PTO 540/1000 rpm',         'TRA-004', 'Transmisión', '#805ad5', '🔗', 'Universal',                            'available', 'Disponible'),
  ('Caja cambios (reconstruida)',     'TRA-005', 'Transmisión', '#805ad5', '⚙️', 'Fendt 700 Vario',                      'out',       'Consultar'),
  ('Retén árbol de transmisión',      'TRA-006', 'Transmisión', '#805ad5', '🔩', 'Universal tractores 4WD',              'available', 'Disponible'),
  ('Alternador 12V / 120A',           'ELE-001', 'Eléctrico',   '#d69e2e', '⚡', 'Universal tractores modernos',         'available', 'Disponible'),
  ('Batería AGM 12V 180Ah',           'ELE-002', 'Eléctrico',   '#d69e2e', '🔋', 'Universal',                            'available', 'Disponible'),
  ('Motor de arranque 12V',           'ELE-003', 'Eléctrico',   '#d69e2e', '🔌', 'Case IH, New Holland, Steyr',          'low',       'Pocas unidades'),
  ('Faros de trabajo LED 60W (par)',  'ELE-004', 'Eléctrico',   '#d69e2e', '💡', 'Universal',                            'available', 'Disponible'),
  ('Sensor temperatura refrigerante', 'ELE-005', 'Eléctrico',   '#d69e2e', '📡', 'Deutz-Fahr, Fendt, Same',             'available', 'Disponible'),
  ('Regulador de tensión alternador', 'ELE-006', 'Eléctrico',   '#d69e2e', '🔦', 'Universal 12V',                        'available', 'Disponible'),
  ('Capot delantero acero',           'CAR-001', 'Carrocería',  '#38a169', '🛡️','Massey Ferguson 5400 Serie',           'low',       'Pocas unidades'),
  ('Asiento confort con suspensión',  'CAR-002', 'Carrocería',  '#38a169', '🪑', 'Universal (rail estándar)',             'available', 'Disponible'),
  ('Enganche 3 puntos cat. II',       'CAR-003', 'Carrocería',  '#38a169', '🔩', 'Universal',                            'available', 'Disponible'),
  ('Gancho remolque 40mm reforzado',  'CAR-004', 'Carrocería',  '#38a169', '🚛', 'Universal tractores',                  'available', 'Disponible'),
  ('Silentblock cabina (kit 4)',      'CAR-005', 'Carrocería',  '#38a169', '🔧', 'John Deere 6000–7000 Series',          'out',       'Sin stock'),
  ('Cristal lateral cabina',          'CAR-006', 'Carrocería',  '#38a169', '🪟', 'Fendt 700–800 Vario',                  'low',       'Pocas unidades'),
  ('Segadora hileradora Rapid Euro',  'RAP-001', 'Jardín',      '#2f855a', '🌿', 'Marca Rapid – distribuidores oficiales','available','Disponible'),
  ('Segadora hileradora Rapid 505',   'RAP-002', 'Jardín',      '#2f855a', '🌿', 'Marca Rapid – recambios originales',   'available', 'Disponible'),
  ('Segadora hileradora Rapid 507',   'RAP-003', 'Jardín',      '#2f855a', '🌿', 'Marca Rapid – recambios originales',   'available', 'Disponible'),
  ('Cortacésped autopropulsado',      'JAR-001', 'Jardín',      '#2f855a', '🌱', 'Varias marcas',                        'available', 'Disponible'),
  ('Tractor cortacésped',             'JAR-002', 'Jardín',      '#2f855a', '🚜', 'Varias marcas',                        'available', 'Disponible'),
  ('Recambios originales Rapid',      'RAP-010', 'Jardín',      '#2f855a', '🔧', 'Rapid Euro, 505, 507 y demás modelos', 'available', 'Disponible'),
  ('Motocultor Piva (varias potencias)','PIV-001','Forestal',   '#276749', '🌲', 'Marca Piva – distribuidores oficiales','available', 'Disponible'),
  ('Motoazada Piva profesional',      'PIV-002', 'Forestal',    '#276749', '🌲', 'Marca Piva',                           'available', 'Disponible'),
  ('Motosierra profesional',          'FOR-001', 'Forestal',    '#276749', '🪚', 'Varias marcas',                        'available', 'Disponible'),
  ('Desbrozadora de hilo/disco',      'FOR-002', 'Forestal',    '#276749', '🌿', 'Varias marcas',                        'available', 'Disponible'),
  ('Soplador / Aspirador-soplador',   'FOR-003', 'Forestal',    '#276749', '💨', 'Varias marcas',                        'available', 'Disponible'),
  ('Cortadora de leña',               'FOR-004', 'Forestal',    '#276749', '🪵', 'Varias marcas',                        'available', 'Disponible'),
  ('Hidrolimpiadora profesional',     'APE-001', 'Aperos',      '#744210', '🚿', 'Varias marcas',                        'available', 'Disponible'),
  ('Abonadora centrífuga',            'APE-002', 'Aperos',      '#744210', '🌾', 'Universal tractores',                  'available', 'Disponible'),
  ('Rotavator / Fresadora',           'APE-003', 'Aperos',      '#744210', '🔄', 'Universal tractores',                  'available', 'Disponible'),
  ('Arado reversible',                'APE-004', 'Aperos',      '#744210', '🏗️','Universal tractores',                  'available', 'Disponible'),
  ('Cajón / Pala para tractor',       'APE-005', 'Aperos',      '#744210', '📦', 'Universal tractores',                  'available', 'Disponible'),
  ('Desbrozadora para tractor',       'APE-006', 'Aperos',      '#744210', '🌿', 'Universal tractores',                  'available', 'Disponible'),
  ('Sulfatadora para tractor',        'APE-007', 'Aperos',      '#744210', '🧴', 'Universal tractores',                  'available', 'Disponible'),
  ('Rastrillo hilerador',             'APE-008', 'Aperos',      '#744210', '🌾', 'Universal tractores',                  'available', 'Disponible'),
  ('Encintadora de forraje',          'APE-009', 'Aperos',      '#744210', '🌀', 'Universal tractores',                  'low',       'Pocas unidades'),
  ('Pincho / Subsolador',             'APE-010', 'Aperos',      '#744210', '🔩', 'Universal tractores',                  'available', 'Disponible')
on conflict do nothing;
