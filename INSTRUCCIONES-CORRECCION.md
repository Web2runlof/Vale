# Vale: solución a las fotos que no cargan en GitHub Pages

## Diagnóstico comprobado en el ZIP recibido

- Las 26 fotos y la portada que estaban subidas como `.webp` contenían bytes JPEG reales.
- Faltaban las fotografías `foto-03.webp` y `foto-24.webp`.
- Los archivos pesaban hasta 7 MB cada uno: la carga acumulada hacía lenta la experiencia en iPhone.
- En GitHub Pages, el sitio se publica en `/Vale/`, no en `/`; la solución ahora calcula todas las URLs con `import.meta.env.BASE_URL`.
- No había videos reales en `public/media/videos/` del ZIP más reciente.

## Qué se corrigió

1. Sustituidos los archivos por 28 imágenes WebP auténticas y portada, optimizadas para móviles (originales no modificados).
2. Recuperadas `foto-03.webp` y `foto-24.webp` del material previamente suministrado.
3. Incorporados 4 MP4 para iPhone con sus 4 posters WebP.
4. Creado `src/utils/publicAsset.ts` para resolver automáticamente las rutas / y /Vale/.
5. Quitado el plugin de sustitución textual frágil del `vite.config.ts`.
6. Añadido un parámetro de versión a las fotos para evitar que Safari sirva imágenes antiguas desde su caché.
7. Añadido `node scripts/verify-media.mjs` a GitHub Actions para impedir nuevos despliegues con archivos renombrados incorrectamente o ausentes.
8. Ajustado el estado de carga en `ImageWithFallback.tsx` al cambiar de fotografía.

## Cómo publicar la corrección completa

**Recomendado: GitHub Desktop**

1. En tu Mac, instala GitHub Desktop y clona `https://github.com/web2runlof/Vale`.
2. Descarga y descomprime el ZIP de corrección que te entregué.
3. Copia *el contenido* de la carpeta `Vale-main/` descomprimida dentro de tu clon local `Vale`, reemplazando archivos. Mantén intacta la carpeta oculta `.git` del clon.
4. Comprueba que copiaron las carpetas ocultas `.github/workflows` y `scripts`.
5. En GitHub Desktop: `Commit to main` > `Push origin`.
6. Ve a `https://github.com/web2runlof/Vale/actions`: espera una ejecución verde del flujo «Publicar Vale en GitHub Pages».
7. Abre `https://web2runlof.github.io/Vale/` y prueba el carrusel, viajes y la portada en Safari.

Si prefieres la web de GitHub, tienes que subir también los archivos de código corregidos, no solo las fotos. No subas el ZIP entero como un único archivo al repositorio.

## Comprobación individual

- https://web2runlof.github.io/Vale/media/photos/hero-vale.webp
- https://web2runlof.github.io/Vale/media/photos/foto-03.webp
- https://web2runlof.github.io/Vale/media/photos/foto-24.webp

Si una URL devuelve 404, falta el archivo o el deploy no terminó. Si alguna URL responde «Rate limit exceeded», espera: es un límite temporal de GitHub Pages, independiente del formato.

## Audio

El audio de voz no se ha incluido porque no estaba disponible en el archivo recibido. El sitio conserva la ruta `public/media/audio/voice-message.mp3` para incorporarlo cuando lo tengas.

## Observación importante

La fecha de cumpleaños que figura en el proyecto recibido está configurada como «12 de octubre», también en el contador de 2027. Confirma si debe permanecer así antes de sorprender a Vale.
