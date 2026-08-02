# Placeholders pendientes de contenido real

Este proyecto no tenía ningún asset en `input/` al momento de generar la landing
(`listar_assets` devolvió la carpeta vacía). Se documentan acá todos los elementos
que quedaron como placeholder y deben resolverse antes de publicar.

## 1. Logo — RESUELTO
- **Dónde:** header (`.logo` en index.html) y footer (`.footer-logo`).
- **Estado actual:** el cliente aportó el archivo real (`input/grand-yield/logo.jpg`), copiado a `output/grand-yield/img/logo.jpg` y referenciado con `<img>` en ambos lugares. Ya no es un placeholder.

## 2. Íconos de redes sociales (Instagram y LinkedIn)
- **Dónde:** sección `.social-icons` en el footer (index.html).
- **Motivo:** el brief aclara "sin enlaces reales aportados todavía — dejar como placeholder marcado si no hay URL".
- **Estado actual:** los enlaces de Instagram y LinkedIn apuntan a `href="#"` con `title`/`aria-label` que indican explícitamente "enlace pendiente de confirmar por el cliente". El ícono de correo sí es funcional (`mailto:hector.grandyield@gmail.com`).
- **Acción pendiente:** reemplazar los `href="#"` por las URLs reales de los perfiles cuando el cliente las provea.

## 3. Fotografías / imágenes del negocio
- **Estado:** no se agregó ninguna imagen de stock ni fotografía inventada, ya que el cliente no aportó ningún asset visual (fotos de clínicas, distribuidoras, academias, equipo, etc.).
- **Diseño elegido:** se optó por un diseño 100% tipográfico/gráfico (fondo degradado oscuro, tarjetas, emojis del copy original) para no depender de imágenes hasta que el cliente entregue material real.
- **Acción pendiente:** si el cliente quiere sumar fotos reales de casos, equipo o clientes de los tres nichos, agregarlas en `input/grand-yield/` y referenciarlas en las secciones "Por qué elegirnos" o "Sobre nosotros".
