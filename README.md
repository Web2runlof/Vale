# VALE — Qué bonito coincidir contigo ❤️
## Experiencia Interactiva de Cumpleaños 2.0 · «Hoy todo se trata de ti»

Una experiencia digital boutique diseñada para celebrar el cumpleaños de Vale con alegría, dinamismo, amor y elegancia. Desarrollada con React, TypeScript, Tailwind CSS, Motion y Lucide Icons.

---

## 🎂 1. Nueva Estructura Narrativa (Birthday 2.0)

1. **Capítulo 0 — El corazón que abre la historia (`HeartGate.tsx`)**:
   - Portada inicial bloqueada que requiere exactamente 5 toques.
   - Cada toque avanza el progreso (20%, 40%, 60%, 80%, 100%) con latidos visuales, micropartículas y frases dulces.
   - Al quinto toque, se produce una transición cinematográfica con halo lavanda y lluvia de confeti ligero que revela la portada.

2. **Capítulo 1 — Portada de Cumpleaños (`HeroBirthday.tsx`)**:
   - Fotografía protagonista: **Foto 9** (`Foto 9.jpeg` / `/media/photos/hero-vale.webp`).
   - Copia de celebración: *«11 OCTUBRE · UN DÍA PARA CELEBRARTE»*, *«¡Feliz cumpleaños, Vale! ❤️»*, *«Qué felicidad que existas.»*, *«Hoy celebro tu vida, tu sonrisa, tus sueños y todas esas cosas maravillosas que te hacen ser tú.»*.
   - Botón directo hacia el carrusel: *«Vamos a celebrar tu vida ✨»*.

3. **Capítulo 2 — Hoy celebramos a Vale (`BirthdayCelebrationCarousel.tsx`)**:
   - Carrusel horizontal mobile-first con desplazamiento táctil nativo (CSS scroll-snap), flechas en desktop e indicadores de progreso.
   - 8 dedicatorias de cumpleaños con sus fotos y frases correspondientes:
     - **Razón 01**: `Foto 6.jpeg` — *«Que nunca te falte esa sonrisa.»*
     - **Razón 02**: `Foto 3.jpeg` — *«Que la vida nunca deje de sorprenderte.»*
     - **Razón 03**: `Foto 5.jpeg` — *«Que sigan llegando aventuras.»*
     - **Razón 04**: `Foto 14.jpeg` — *«Brindo por todo lo bonito que viene.»*
     - **Razón 05**: `Foto 1.jpeg` — *«Por tu ternura y tus locuras.»*
     - **Razón 06**: `Foto 19.jpeg` — *«Que nunca te falten ganas de disfrutar.»*
     - **Razón 07**: `Foto 24.jpeg` — *«Por todas las versiones de ti.»*
     - **Razón 08**: `Foto 12.jpeg` — *«Hoy pide todos los deseos que quieras.»*
   - Microinteracción de corazones en cada diapositiva con deseos interactivos.
   - Cierre: *«Y si hay algo que deseo para ti, es que nunca dejes de vivir cosas extraordinarias.»*

4. **Capítulo 4 — Por todos los lugares que te esperan (`TravelStory.tsx`)**:
   - Enfoque festivo y deseos de futuro: *«El mundo te queda precioso, Vale.»*.
   - Fotografías reales de Vale en viajes y naturaleza (`foto 2`, `foto 4`, `foto 7`, `Foto 8 `, `Foto 11`, `Foto 13`, `foto 15`, `foto 16`, `Foto 17`, `Foto 18`, `Foto 20`, `Foto 21`, `Foto 22`, `Foto 23`).
   - 4 escenas cinematográficas: panorámica, collage editorial, galería dinámica y cierre en morado profundo.

5. **Capítulo 5 — Carta personal en tu cumpleaños (`LoveLetter.tsx`)**:
   - Carta íntima conservada de forma 100% íntegra y verbatim.
   - Tipografía editorial, pliego sobre marfil con matiz lavanda y corazón animado.

6. **Capítulo 6 — Algo más para ti (`MemoriesSection.tsx`)**:
   - **Nota de voz personal (`VoicePlayer.tsx`)**: *«Un mensaje de cumpleaños, amorcito. ❤️»*.
   - **4 Tarjetas de video verticales 9:16 (`VideoMemory.tsx`)**: *«La felicidad también se ve así. ✨»* con transiciones de scroll reveal, controles táctiles y pausa coordinada.

7. **Capítulo 7 — La sorpresa de cumpleaños (`BirthdayGift.tsx` & `DateSelector.tsx`)**:
   - Pantalla previa en morado profundo: *«¡Todavía tengo una sorpresa para ti! 🎁»*.
   - Apertura 3D con confeti: *«¡Tenemos una cita de cumpleaños, Vale! ❤️»* (desayuno / brunch sorpresa).
   - Calendario interactivo funcional para elegir la fecha (zona horaria Bogotá) y confirmación por WhatsApp o portapapeles.
   - Fotografías de cierre compartidas (Fotos 25, 26, 27 y 28) y despedida: *«Te amo, Vale. ❤️»*.

---

## 📸 2. Dónde colocar las 28 fotografías originales

Coloca los archivos de tu carpeta de fotos en `public/media/photos/`.
El sistema cuenta con una capa de resolución inteligente que acepta tanto los nombres originales (con mayúsculas y espacios) como las versiones normalizadas:

| Uso en la web | Archivo original esperado | Ruta normalizada recomendada |
|---|---|---|
| **Portada Protagonista** | `Foto 9.jpeg` | `/media/photos/hero-vale.webp` o `/media/photos/foto-09.webp` |
| **Carrusel Razón 01** | `Foto 6.jpeg` | `/media/photos/foto-06.webp` |
| **Carrusel Razón 02** | `Foto 3.jpeg` | `/media/photos/foto-03.webp` |
| **Carrusel Razón 03** | `Foto 5.jpeg` | `/media/photos/foto-05.webp` |
| **Carrusel Razón 04** | `Foto 14.jpeg` | `/media/photos/foto-14.webp` |
| **Carrusel Razón 05** | `Foto 1.jpeg` | `/media/photos/foto-01.webp` |
| **Carrusel Razón 06** | `Foto 19.jpeg` | `/media/photos/foto-19.webp` |
| **Carrusel Razón 07** | `Foto 24.jpeg` | `/media/photos/foto-24.webp` |
| **Carrusel Razón 08** | `Foto 12.jpeg` | `/media/photos/foto-12.webp` |
| **Viajes / Nieve** | `foto 2.jpeg` | `/media/photos/foto-02.webp` |
| **Viajes / Montaña** | `foto 4.jpeg` | `/media/photos/foto-04.webp` |
| **Viajes / Aire libre** | `foto 7.jpeg` | `/media/photos/foto-07.webp` |
| **Viajes / Altura** | `Foto 8 .jpeg` | `/media/photos/foto-08.webp` |
| **Viajes / Mar** | `Foto 11.jpeg` | `/media/photos/foto-11.webp` |
| **Viajes / Ciudad** | `Foto 13.jpeg` | `/media/photos/foto-13.webp` |
| **Viajes / Detalle** | `foto 15.jpeg` | `/media/photos/foto-15.webp` |
| **Viajes / Rincones** | `foto 16.jpeg` | `/media/photos/foto-16.webp` |
| **Viajes / Mirador** | `Foto 17.jpeg` | `/media/photos/foto-17.webp` |
| **Viajes / Ribera** | `Foto 18.jpeg` | `/media/photos/foto-18.webp` |
| **Viajes / Noche urbana** | `Foto 20.jpeg` | `/media/photos/foto-20.webp` |
| **Viajes / Postal nocturna**| `Foto 21.jpeg` | `/media/photos/foto-21.webp` |
| **Viajes / Metrópoli** | `Foto 22.jpeg` | `/media/photos/foto-22.webp` |
| **Viajes / Invierno** | `Foto 23.jpeg` | `/media/photos/foto-23.webp` |
| **Cierre / Nosotros** | `foto 10.jpeg` | `/media/photos/foto-10.webp` |
| **Cierre / Momentos** | `foto 25.jpeg` | `/media/photos/foto-25.webp` |
| **Cierre / Amor** | `foto 26.jpeg` | `/media/photos/foto-26.webp` |
| **Cierre / Futuro** | `foto 27.jpeg` | `/media/photos/foto-27.webp` |
| **Fotografía Final** | `Foto 28.jpeg` | `/media/photos/foto-28.webp` |

> Si algún archivo aún no está cargado, el componente `ImageWithFallback` renderiza automáticamente un recuadro editorial estético con el nombre del archivo y la dedicatoria, sin romper el diseño ni mostrar errores.

---

## 🎬 3. Cómo incorporar los 4 videos

Coloca tus 4 videos en `public/media/videos/`:

1. **Video 1 — Un momento divertido**:
   - Nombre original: `8307056ad70e48c98d275dbb7158d215.mov`
   - O versión convertida a MP4: `video-01.mp4`
2. **Video 2 — Alegría junto al mar**:
   - Nombre original: `IMG_7547.MOV`
   - O versión convertida a MP4: `video-02.mp4`
3. **Video 3 — Aventuras en la nieve**:
   - Nombre original: `IMG_0198.MOV`
   - O versión convertida a MP4: `video-03.mp4`
4. **Video 4 — Una sonrisa frente al mar**:
   - Nombre original: `IMG_3437.MOV`
   - O versión convertida a MP4: `video-04.mp4`

### Comando para optimizar de MOV a MP4 (H.264/AAC móvil):
```bash
ffmpeg -i 8307056ad70e48c98d275dbb7158d215.mov -c:v libx264 -pix_fmt yuv420p -movflags +faststart video-01.mp4
ffmpeg -i IMG_7547.MOV -c:v libx264 -pix_fmt yuv420p -movflags +faststart video-02.mp4
ffmpeg -i IMG_0198.MOV -c:v libx264 -pix_fmt yuv420p -movflags +faststart video-03.mp4
ffmpeg -i IMG_3437.MOV -c:v libx264 -pix_fmt yuv420p -movflags +faststart video-04.mp4
```

---

## 🎙️ 4. Cómo cargar el mensaje de audio

Coloca tu archivo de voz en:
`public/media/audio/voice-message.mp3`

El reproductor detecta si el archivo existe en el navegador. Si aún no está colocado, muestra un estado pendiente claro y elegante sin fingir reproducciones ni inventar duraciones falsas. Cuando el archivo se carga, ofrece reproducción real con onda sonora activa.

---

## 💬 5. Configuración de WhatsApp para el desayuno sorpresa

En `src/content/birthdayConfig.ts`:
```ts
gift: {
  recipientWhatsApp: "573001234567", // Tu número con código de país sin '+' ni espacios
}
```
Si se deja en blanco `""`, el botón copia automáticamente el mensaje al portapapeles con una confirmación visual.

---

## 📱 6. Optimizaciones para iPhone y Safari iOS

- Viewport dinámico (`100dvh`) y soporte para `env(safe-area-inset-bottom)`.
- Áreas táctiles mayores a 44x44 px.
- Carrusel con CSS scroll-snap e inercia nativa táctil que no bloquea el scroll vertical.
- Detección de visibilidad con IntersectionObserver para pausar videos al salir del viewport.
- Reproducción coordinada: activar un video pausa los demás y atenúa la música ambiental.
