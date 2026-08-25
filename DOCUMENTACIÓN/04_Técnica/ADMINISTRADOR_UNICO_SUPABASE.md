# Administrador único de Supabase

## Modelo de acceso

- La web pública puede leer catálogo, multimedia y configuración.
- No existe registro público desde las aplicaciones.
- Solo una cuenta creada manualmente en Supabase Auth se incorpora a `public.admin_users`.
- Las tablas y Storage comprueban esa lista blanca antes de insertar, modificar o borrar.
- La clave `service_role` no se utiliza en ningún frontend.

## Activación de la cuenta del cliente

1. En Supabase Dashboard, abre **Authentication → Users → Add user**.
2. Crea la cuenta con el correo del cliente y una contraseña fuerte.
3. Mantén desactivada la creación pública de cuentas.
4. En SQL Editor, autoriza esa cuenta:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'correo-del-cliente@example.com'
on conflict (user_id) do nothing;
```

5. Comprueba que la consulta devuelve una fila:

```sql
select au.user_id, u.email
from public.admin_users au
join auth.users u on u.id = au.user_id;
```

## Estado de seguridad verificado

- Lectura anónima de `categories`, `parts`, `part_media` y `site_settings`: permitida.
- Escritura anónima: bloqueada.
- `site_settings`: creada con una única fila inicial.
- Buckets públicos: `parts-images` y `parts-videos`.
- Imágenes: límite 10 MB y tipos JPEG, PNG, WebP y GIF.
- Vídeos: límite 100 MB y tipos MP4, WebM y QuickTime.
