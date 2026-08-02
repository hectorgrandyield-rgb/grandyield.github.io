# Notas del proyecto — Grand Yield

## Resumen
Landing de una sola página (`index.html` + `style.css` + `script.js`) para Grand Yield,
agencia de marketing + IA enfocada en tres nichos: clínicas de turismo médico,
distribuidoras B2B y academias (artes marciales, música, baile).

Todo el copy provisto en `existing_copy` del brief se reutilizó **tal cual**, sin
reescribir ni resumir, tal como pedía el brief explícitamente.

## Assets del cliente
`listar_assets` devolvió la carpeta de input vacía: el cliente no aportó fotos, logo
ni ningún otro archivo. Por eso:
- No se usó ninguna imagen de stock ni fotografía inventada.
- El diseño es 100% tipográfico/gráfico: fondo degradado oscuro (paleta del brief:
  `#0a0e1a` → `#000000`, texto blanco), tarjetas y los emojis que ya venían en el copy.
- Todos los placeholders quedaron documentados en `PLACEHOLDERS.md` (logo pendiente,
  íconos de Instagram/LinkedIn sin URL real).

## Supuestos tomados (el brief no los especificaba)
1. **Botón "Agendar llamada"**: el brief menciona la acción ("agendar una llamada
   gratuita") pero no da ningún link de calendario (Calendly, Cal.com, etc.). Se
   linkeó a un `mailto:` a `hector.grandyield@gmail.com` con asunto y cuerpo
   pre-completados, pidiendo agendar la llamada. **Revisar con el cliente**: si tienen
   una herramienta de agendamiento (Calendly u otra), reemplazar este link por la URL
   real en los dos lugares donde aparece el botón (hero y CTA final).
2. **Formato del número de WhatsApp**: se usó `5565091601` tal como aparece en el
   brief, sin agregar código de país, ya que el brief lo dio en ese formato y pidió
   explícitamente "enlaza a wa.me con el número de contacto". Si wa.me no resuelve
   correctamente (falta código de país), avisar para corregir el link en los 8 lugares
   donde aparece (nav, hero, 6 tarjetas de servicio, CTA final, footer, botón flotante).
3. **Año del footer**: se puso "© 2024" como año de referencia; ajustar si corresponde
   a otro año en el momento de publicar.
4. **Textos de mensajes prellenados de WhatsApp** por servicio (ej. "Hola, quiero
   preguntar sobre el Asistente de IA Pro"): son mensajes cortos inventados a partir
   del nombre de cada servicio del propio copy aprobado, no contenido nuevo de marketing;
   se puede ajustar el fraseo si el cliente prefiere otro tono para esos mensajes.

## Validaciones ejecutadas
- `validar_html`: sin problemas detectados (jerarquía de headings, alt en imágenes —no
  hay imágenes locales—, links internos).
- `checklist_seo`: viewport, lang y peso de imágenes OK. Se detectaron dos advertencias
  de tipo "FALTA" (no bloqueantes):
  - El `<title>` tiene 70 caracteres (ideal 10–60).
  - La meta description tiene 178 caracteres (ideal 50–160).
  Se intentó corregir ambos acortando el título y la descripción, pero la escritura del
  archivo con ese cambio fue **DENEGADA por el humano**. Por lo tanto se documenta acá
  el hallazgo y se deja pendiente de decisión humana: si se aprueba, el ajuste sugerido
  era usar `title` = "Grand Yield — Marketing + IA para tu negocio" (43 caracteres) y
  `description` = "Marketing e IA para clínicas, distribuidoras B2B y academias. Acompañamiento
  cercano y resultados reales. Agenda tu consulta gratuita." (~148 caracteres). Ninguno
  de los dos afecta la funcionalidad ni la semántica de la página; son solo
  recomendaciones de largo para snippets en buscadores.

## Límites respetados
- Sin scripts de tracking/analytics.
- Sin formularios que envíen datos a backend/servicio externo (los "formularios" son
  en realidad links a WhatsApp/mailto, que abren la app del cliente, no envían nada
  a un servidor propio).
- Sin testimonios, cifras ni certificaciones inventadas (el brief pidió explícitamente
  no tomar las cifras/testimonios de la referencia visual).
- Sin dependencias externas (CDNs, frameworks): solo HTML/CSS/JS propio.
- Sin imágenes de stock: se usó diseño gráfico/tipográfico en su lugar.

## Pendiente de revisión humana
1. Confirmar o corregir el link de "Agendar llamada" (actualmente `mailto:`).
2. Confirmar el número de WhatsApp completo (con código de país si aplica).
3. Decidir si se aprueba el acortamiento de `<title>` y meta description (ver detalle
   arriba) para cumplir el rango ideal de `checklist_seo`.
4. Confirmar los links reales de Instagram/LinkedIn cuando el cliente los envíe
   (ver `PLACEHOLDERS.md`); el logo ya se agregó (ver abajo).

## Ediciones manuales post-generación (fuera del agente, a pedido directo del cliente en chat)
Estos cambios se hicieron editando los archivos de `output/grand-yield/` directamente
con Claude Code, no volviendo a correr `npm run generate` — por eso no pasaron por el
gate de aprobación `escribir_archivo` del agente ni quedaron en `audit.log`. Se documentan
acá para que quede el rastro:

1. **Logo real**: el cliente envió el archivo por chat (JPEG, sin canal alfa —
   confirmado con Pillow: `Image.open(...).mode == 'RGB'`, ninguna de las 3 versiones
   que mandó tenía transparencia real). Se guardó el original en
   `input/grand-yield/logo.jpg`. Primer intento: copiarlo tal cual a
   `output/grand-yield/img/logo.jpg` y usar `mix-blend-mode: screen` en `.logo-img`
   para disimular el fondo negro — el cliente reportó que seguía viéndose el
   recuadro. Solución final: se generó `output/grand-yield/img/logo.png` con
   **transparencia real**, usando el brillo (luminancia) de cada píxel del JPEG
   como canal alfa (texto blanco → opaco, fondo negro → transparente) vía Pillow.
   Se referencia ese PNG en el HTML y ya no hace falta el truco de `mix-blend-mode`.
   Tamaño subido a 88px (header) / 116px (footer) a pedido del cliente.
2. **Tarjetas y fondo con degradado más visible**: `.niche-card` y `.service-card`
   pasaron de un color sólido a un degradado navy→negro (misma paleta del brief);
   el fondo del body usa `background-attachment: fixed` para que el degradado se
   note en cada scroll de pantalla en vez de diluirse en una página larga.
3. **Botones**: `.btn-solid` y `.btn-outline` ahora muestran degradado visible en su
   estado normal, y al hacer hover/focus se iluminan con un overlay blanco
   traslúcido + contorno "neón" (`box-shadow` en capas blancas).
4. **Títulos con brillo neón**: `.hero h1` y `.cta-final h2` tienen `text-shadow`
   en capas blancas para el efecto neón que pidió el cliente.
5. **Tipografía (Google Fonts, auto-alojada) — ver nota de seguridad**: un `<link>`
   en vivo a `fonts.googleapis.com` está prohibido por `SECURITY_LIMITS` (dependencia
   externa no pedida por el brief original), así que se le planteó la disyuntiva al
   cliente en el chat y eligió **auto-alojar la fuente**: los archivos `.woff2` se
   descargan una vez y se guardan en `output/grand-yield/fonts/`, referenciados con
   `@font-face` local — la página no hace ningún pedido a servidores externos al
   cargar. Iteraciones de esta decisión:
   - Primero se probó **Dancing Script** (cursiva) → el cliente la encontró poco
     legible y "fea".
   - Se cambió a **Pacifico** (script más simple) → tampoco convenció.
   - El cliente mandó capturas de un sitio de referencia (bizzgrowth.co) y pidió
     identificar y usar esa tipografía. Es una sans-serif geométrica y redondeada
     en negrita para títulos grandes, coherente con **Poppins** (Google Fonts). Se
     descargaron los pesos 400 (texto), 600 (subtítulos/etiquetas) y 800 (títulos),
     y se aplicó **en toda la página** (no solo en los dos títulos), reemplazando
     el stack de fuentes del sistema que tenía el `body`.
   Los archivos `dancing-script-700.woff2` y `pacifico-400.woff2` se borraron al
   quedar sin uso.
6. **Año del footer**: corregido de "© 2024" (año fijo que había puesto el agente,
   señalado como pendiente de revisión en este mismo archivo) a "© 2026".
7. **Botones parejos**: `.hero-buttons .btn` ahora tiene `min-width: 260px` y texto
   centrado, para que "Agendar llamada →" y "Escríbenos por WhatsApp 💬" midan lo
   mismo en vez de que cada uno se ajuste solo a su propio texto. En pantallas muy
   angostas (`max-width: 420px`) pasan a 100% de ancho y permiten salto de línea
   para no desbordar.
8. **Fondo animado**: el degradado del `body` ahora se desplaza continuamente
   (`@keyframes bgPulse`, 18s, `ease-in-out`, loop infinito). Se respeta
   `prefers-reduced-motion: reduce` (desactiva la animación para quien lo tenga
   configurado en su sistema) por accesibilidad.
9. **Azul más claro agregado al degradado**: se sumó un tono `#33499e` (azul medio,
   más claro que el navy `#1c2a52` original) como parada extra del degradado, para
   que aparezca y desaparezca ("parpadee") durante el ciclo de la animación del
   fondo. Sigue siendo parte de la misma familia de azules del brief, no es un
   color nuevo fuera de la paleta.
