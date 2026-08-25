# Fase 2 — Web pública

Fecha de revisión: 25/08/2026  
Responsable: Javier Fernández Gutiérrez

## Alcance ejecutado

- Navegación con URLs limpias y redirección preparada para Netlify.
- Títulos, descripciones, canonical, Open Graph y directiva robots específicos por ruta.
- Carga diferida de las páginas secundarias y de las imágenes del catálogo.
- Imagen principal optimizada de 3,1 MB a aproximadamente 377 KB en WebP.
- Mejoras de teclado: enlace para saltar al contenido, foco visible, cierre de menú y detalle con Escape, navegación del carrusel con flechas y foco inicial en el modal.
- Estados del catálogo anunciados mediante regiones accesibles y filtros identificados como botones de estado.
- Páginas base de aviso legal, privacidad y cookies enlazadas desde el pie.
- `robots.txt` incluido; el sitemap se añadirá cuando se confirme el dominio definitivo.
- Diseño comprobado a 1280 × 720 y 390 × 844 sin desbordamiento horizontal.

## Verificación

- Catálogo público conectado a Supabase: 8 categorías y 54 piezas de demostración.
- Portada, servicios, catálogo, contacto y páginas legales: respuesta HTTP 200.
- Catálogo: 54 tarjetas renderizadas sin errores y carga diferida de imágenes activa.
- Modal de pieza: foco inicial correcto y cierre mediante Escape.
- `npm run format:check`: correcto.
- `npm run lint`: correcto.
- `npm test`: 2 pruebas correctas.
- `npm run build`: correcto; 104 módulos y JavaScript principal de aproximadamente 335 KB.
- `npm audit --audit-level=high`: 0 vulnerabilidades.

## Pendiente de validación del cliente

- Confirmar todos los textos, marcas, cifras y afirmaciones comerciales.
- Facilitar nombre o razón social, NIF y proveedor de alojamiento para cerrar los textos legales.
- Confirmar dominio definitivo para generar y registrar el sitemap.
- Elegir si se necesita analítica y, en ese caso, qué proveedor utilizar.
- Ejecutar una auditoría Lighthouse y acordar los objetivos finales de rendimiento y accesibilidad.

Los datos del catálogo siguen siendo demostrativos. El cliente cargará las categorías y piezas reales desde el panel web antes de la publicación.
