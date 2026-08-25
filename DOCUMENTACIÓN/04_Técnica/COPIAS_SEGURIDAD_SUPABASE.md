# Copias de seguridad y recuperación de Supabase

Proyecto: **Talleres Enrique**  
Referencia: `afqfsleyogtjvxfurqyn`  
Región: `eu-west-1`  
Responsable: **Javier Fernández Gutiérrez**  
Última revisión: 25/08/2026

## Objetivo

Poder recuperar el catálogo, la configuración pública y los archivos multimedia ante un borrado accidental, una modificación incorrecta o una incidencia del proyecto.

El proyecto utiliza el plan gratuito. Supabase recomienda que los proyectos Free exporten periódicamente sus datos con `supabase db dump` y conserven copias fuera del proyecto. Las copias de la base de datos no incluyen los archivos físicos de Storage: solo incluyen sus metadatos.

## Objetivos operativos

- Frecuencia: una copia semanal y otra antes de cambios importantes.
- RPO objetivo: máximo 7 días de datos perdidos.
- RTO objetivo inicial: restauración durante el siguiente día laborable.
- Retención: 4 copias semanales y 3 copias mensuales.
- Ubicación: carpeta cifrada fuera del repositorio Git y una segunda copia externa.

## Contenido que debe protegerse

1. Esquema y políticas: migraciones guardadas en `supabase/migrations` y versionadas en Git.
2. Datos de aplicación: `categories`, `parts`, `part_media`, `site_settings` y `admin_users`.
3. Archivos: contenido completo de `parts-images` y `parts-videos`.
4. Acceso: correo del administrador y procedimiento para recrearlo. Nunca guardar su contraseña.

## Procedimiento de copia

### 1. Preparación inicial

La CLI de Supabase no está instalada actualmente en el equipo. Antes de la primera copia:

1. Instalar la CLI siguiendo la documentación oficial.
2. Ejecutar `supabase --version` y conservar la versión en el registro de la copia.
3. Ejecutar `supabase db dump --help` para confirmar las opciones disponibles.
4. Autenticarse con `supabase login`.
5. Vincular el repositorio con `supabase link --project-ref afqfsleyogtjvxfurqyn`.

La contraseña de la base de datos y los tokens nunca deben escribirse en scripts, documentos ni archivos versionados.

### 2. Esquema

Crear una exportación del esquema en una carpeta externa fechada:

```powershell
supabase db dump --linked --file schema.sql
```

Las migraciones del repositorio siguen siendo la fuente principal del esquema. El volcado sirve como comprobación adicional del estado remoto.

### 3. Datos

Crear un volcado independiente de los datos:

```powershell
supabase db dump --data-only --linked --file data.sql
```

Revisar que el archivo no se añada a Git. Los datos reales y los identificadores de autenticación deben tratarse como información privada.

### 4. Storage

Descargar por separado todos los objetos de:

- `parts-images`
- `parts-videos`

La copia debe conservar el nombre del bucket y la ruta exacta de cada objeto. Un volcado de PostgreSQL no recupera un archivo eliminado de Storage.

### 5. Registro y validación

Para cada copia se debe guardar un pequeño registro con:

- Fecha y hora.
- Persona que la realizó.
- Versión de la CLI.
- Tamaño de `schema.sql` y `data.sql`.
- Número de categorías, piezas, relaciones multimedia, imágenes y vídeos.
- Resultado: correcto o con incidencias.

Valores de referencia a 25/08/2026:

- 8 categorías.
- 54 piezas.
- 3 relaciones en `part_media`.
- 4 imágenes en Storage.
- 2 vídeos en Storage.
- 1 administrador autorizado.
- 1 fila de configuración del sitio.

## Procedimiento de recuperación

1. Detener temporalmente las ediciones del panel.
2. Identificar la última copia válida anterior a la incidencia.
3. Crear un proyecto o rama temporal para la prueba; nunca probar directamente sobre producción.
4. Aplicar primero las migraciones del repositorio.
5. Restaurar los datos del volcado.
6. Volver a subir los objetos de Storage conservando buckets y rutas.
7. Recrear o verificar la cuenta administradora y su fila en `admin_users`.
8. Comprobar los recuentos de la copia.
9. Probar acceso, categorías, piezas, configuración, imágenes y vídeos.
10. Documentar el resultado antes de autorizar una restauración sobre producción.

## Criterios de validación

La restauración se considera correcta cuando:

- La web pública carga sin errores.
- El administrador puede iniciar sesión.
- Los recuentos coinciden con el registro de la copia.
- Se puede leer, crear, editar y eliminar una pieza de prueba.
- Las imágenes y vídeos se abren correctamente.
- Las políticas RLS siguen bloqueando la escritura anónima.

## Pendiente para cerrar la tarea

- Instalar y vincular la CLI de Supabase.
- Generar la primera copia real fuera del repositorio.
- Descargar los seis objetos actuales de Storage.
- Ejecutar una restauración de prueba en un entorno temporal.
- Anotar fecha, duración e incidencias de la prueba.

## Referencias

- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/reference/cli/supabase-db-dump
- https://supabase.com/docs/guides/local-development/cli-workflows
