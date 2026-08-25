# Alcance y gobierno del proyecto

## Responsable

- Responsable principal: Javier Fernández Gutiérrez.
- Fecha objetivo de lanzamiento: por definir.

## Alcance aprobado

El proyecto incluye:

- Sitio web público `talleres-enrique`.
- Panel administrativo `talleres-admin` para navegador y Windows mediante Tauri.
- Backend, autenticación, base de datos y almacenamiento en Supabase.
- Repositorio, automatización, pruebas, despliegue y documentación operativa.

La aplicación Android queda expresamente fuera del alcance. El código generado que ya existe se conserva como referencia, pero no se planificarán compilación, pruebas ni publicación de APK.

## Flujo Git

- `main`: versión estable y publicable.
- `develop`: integración de cambios ya verificados.
- `codex/<objetivo>`: ramas de trabajo acotadas; se integran en `develop` después de pasar las comprobaciones.
- Los commits deben describir el resultado, por ejemplo: `chore: completar estabilización de fase 0`.

## Criterio de cierre de la fase 0

- Estructura documental consolidada y registrada en Git.
- Alcance y responsable documentados.
- Dependencias sin vulnerabilidades conocidas por `npm audit`.
- Comandos de lint, formato, pruebas y build disponibles.
- `npm run lint`, `npm test` y `npm run build` correctos en ambos proyectos.
