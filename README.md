# Iron House — proyecto demo

Web estática en HTML, CSS y JavaScript, sin frameworks. Abrir `index.html` para comenzar. Las imágenes externas requieren internet.

## Archivos
- `index.html`: portada, secciones, menú lateral, redes y footer.
- `style.css`: estilos por sección y breakpoints consolidados (1200, 1000, 900, 800 y 500 px).
- `scrip.js`: menú accesible, catálogo de portada, contacto y animaciones.
- `plans.js`: catálogo compartido; nombres, importes ficticios, frecuencia y beneficios.
- `checkout.html`: resumen del plan y formulario demo.
- `checkout.js`: lectura de query string y validación local, sin envío ni almacenamiento.
- `img/gimnasio-interior.png`: imagen original conservada.
- `tests/verify.cjs`: verificación local sin dependencias; ejecutar `node tests/verify.cjs`.

## Planes y checkout
Rutas: `checkout.html?plan=dia`, `checkout.html?plan=3-veces` y `checkout.html?plan=libre`.
Un parámetro ausente o inválido muestra un enlace para volver a elegir; nunca selecciona un plan silenciosamente.
Los campos requieren nombre no vacío, email con formato válido y teléfono de 7 a 15 dígitos. Usar datos ficticios.
El formulario solo muestra una confirmación dentro de la página. No hay pagos, tarjetas, APIs, base de datos ni persistencia.
El formulario permanece deshabilitado si JavaScript no se ejecuta.

Cambiar el catálogo en `plans.js` actualiza portada y checkout con JavaScript. Mantener también las tarjetas HTML de respaldo sincronizadas para visitas sin JavaScript.

## Contacto
En `scrip.js`, el objeto `config` contiene el número ficticio de WhatsApp, el mensaje e Instagram (#).
Actualizar también los enlaces HTML de respaldo y el teléfono visible si se incorporan datos reales.
La dirección demo aparece en Contacto y Footer; abre una búsqueda en Google Maps en otra pestaña.

## Comprobaciones realizadas
- Sintaxis de los archivos JavaScript.
- Estructura de etiquetas, IDs, recursos locales y enlaces internos de ambas páginas.
- Los tres planes y sus importes, parámetros ausentes e inválidos.
- Validación de campos vacíos, espacios, email y teléfono inválidos, y confirmación válida.
- Prevención del envío del formulario.
- Apertura/cierre del menú, overlay, Escape, ciclo de Tab y cambio a desktop.
Estas pruebas usan dobles de DOM y no sustituyen la revisión en un navegador real.

## Revisión visual pendiente
La herramienta de navegador bloqueó el acceso al archivo local en esta sesión. Revisar manualmente:
1. Portada y checkout a 1440, 1024, 768, 375 y 320 px, sin desplazamiento horizontal.
2. Menú desde la derecha, cierre con overlay/enlace/Escape y navegación por teclado.
3. Hero e imagen de Sobre nosotros, carga de fotos externas y proporciones de galería.
4. WhatsApp flotante al desplazarse y botones de contacto, para detectar posibles superposiciones.
5. Los tres recorridos de elección, errores del formulario y mensaje final.
6. Animaciones con movimiento reducido activado.

## Segunda versión
Login, registro, base de datos, pagos y QR quedan fuera de esta demo. Si se desarrollan, separarlos en módulos y servicios con validación de servidor. No poner secretos ni contraseñas en el JavaScript público.
