import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "motion/react";
import { Compass, Sparkles, Heart, PawPrint } from "lucide-react";
import { copy } from "../content/copy";
import { galleryPhotos, BirthdayPhoto } from "../content/galleryData";
import { ImageWithFallback } from "./ImageWithFallback";
import { FullBleedScene } from "./motion/FullBleedScene";
import { ClipReveal } from "./motion/ClipReveal";
import { RevealText } from "./motion/RevealText";
import { easeCinematic } from "../motion/presets";
import { triggerCelebrationConfetti } from "../utils/confettiCelebration";

interface TravelStoryProps {
  onPhotoClick: (photo: BirthdayPhoto) => void;
}

export const TravelStory: React.FC<TravelStoryProps> = ({ onPhotoClick }) => {
  const travelPhotos = galleryPhotos.filter((p) => p.category === "travel");

  // Escena A: Foto 2
  const sceneAPhoto = travelPhotos.find((p) => p.id === 2) || travelPhotos[0];

  // Escena B: Zoom-through center (Foto 8) + surrounding collage (Fotos 4, 11, 13)
  const photo8 = travelPhotos.find((p) => p.id === 8) || sceneAPhoto;
  const photo4 = travelPhotos.find((p) => p.id === 4) || travelPhotos[1];
  const photo11 = travelPhotos.find((p) => p.id === 11) || travelPhotos[2];
  const photo13 = travelPhotos.find((p) => p.id === 13) || travelPhotos[3];

  // Escena C: Asymmetric Masonry (Fotos 17, 18, 20, 21, 22)
  const sceneCPhotos = [
    travelPhotos.find((p) => p.id === 17),
    travelPhotos.find((p) => p.id === 18),
    travelPhotos.find((p) => p.id === 20),
    travelPhotos.find((p) => p.id === 21),
    travelPhotos.find((p) => p.id === 22),
  ].filter(Boolean) as BirthdayPhoto[];

  // Escena D: Foto 23 (Cierre de viajes)
  const sceneDPhoto = travelPhotos.find((p) => p.id === 23) || travelPhotos[travelPhotos.length - 1];

  // Zoom-through scroll ref
  const zoomThroughRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: zoomProgress } = useScroll({
    target: zoomThroughRef,
    offset: ["start start", "end end"],
  });

  // Central Photo 8: starts at 0.35 scale, scales to 1.0 (filling container)
  const centerScale = useTransform(zoomProgress, [0.1, 0.85], [0.35, 1.0]);
  const centerBorderRadius = useTransform(
    zoomProgress,
    [0.1, 0.85],
    ["28px", "0px"]
  );

  // Surrounding photos scatter outward and fade away
  const p4X = useTransform(zoomProgress, [0.05, 0.65], ["0%", "-140%"]);
  const p4Y = useTransform(zoomProgress, [0.05, 0.65], ["0%", "-120%"]);
  const p4Opacity = useTransform(zoomProgress, [0.2, 0.6], [1, 0]);

  const p11X = useTransform(zoomProgress, [0.05, 0.65], ["0%", "140%"]);
  const p11Y = useTransform(zoomProgress, [0.05, 0.65], ["0%", "-110%"]);
  const p11Opacity = useTransform(zoomProgress, [0.2, 0.6], [1, 0]);

  const p13X = useTransform(zoomProgress, [0.05, 0.65], ["0%", "110%"]);
  const p13Y = useTransform(zoomProgress, [0.05, 0.65], ["0%", "130%"]);
  const p13Opacity = useTransform(zoomProgress, [0.2, 0.6], [1, 0]);

  const sceneBTextOpacity = useTransform(zoomProgress, [0.15, 0.55], [1, 0]);

  // Finale Confetti Trigger: activates automatically when user finishes viewing the last message in Viajes & Naturaleza
  const finaleMessageRef = useRef<HTMLDivElement>(null);
  const isFinaleMessageInView = useInView(finaleMessageRef, {
    once: true,
    amount: 0.5,
  });
  const hasExplodedFinaleRef = useRef(false);

  useEffect(() => {
    if (isFinaleMessageInView && !hasExplodedFinaleRef.current) {
      hasExplodedFinaleRef.current = true;
      // Trigger when the user finishes reading/viewing the final message
      const timer = setTimeout(() => {
        triggerCelebrationConfetti(Boolean(shouldReduceMotion));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isFinaleMessageInView, shouldReduceMotion]);

  return (
    <section id="viajes" className="relative bg-[#2A1535] text-white">
      {/* ========================================================
          CHAPTER HEADER
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: easeCinematic }}
        className="pt-8 pb-16 sm:pt-10 sm:pb-20 px-6 sm:px-12 text-center max-w-3xl mx-auto space-y-4"
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A8DF]">
          <Compass className="w-3.5 h-3.5 text-[#C7A8DF]" />
          <span>{copy.travel.tag}</span>
        </div>

        <RevealText
          text={copy.travel.title}
          as="h2"
          by="words"
          className="font-editorial-title text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.12] text-balance"
        />

        <p className="text-base sm:text-lg text-[#EADCF5]/85 font-light leading-relaxed max-w-2xl mx-auto">
          {copy.travel.subtitle}
        </p>

        <p className="font-serif italic text-xl sm:text-2xl text-[#C7A8DF] pt-2">
          "{copy.travel.secondaryQuote}"
        </p>
      </motion.div>

      {/* ========================================================
          ESCENA A: Full-Bleed Sticky Panorama (Foto 2)
          ======================================================== */}
      <FullBleedScene
        photo={sceneAPhoto}
        heightVh={180}
        align="bottom-left"
        onClickPhoto={() => onPhotoClick(sceneAPhoto)}
        priority={false}
      >
        <div className="space-y-3 pb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[#C7A8DF] font-semibold">
            <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
            <span>Horizontes</span>
          </span>
          <p className="font-editorial-quote text-2xl sm:text-3xl lg:text-4xl text-white font-medium leading-snug drop-shadow-md">
            "{copy.travel.sceneA}"
          </p>
          <p className="font-serif italic text-sm sm:text-base text-[#EADCF5]/80 leading-relaxed max-w-lg text-pretty">
            {sceneAPhoto.caption}
          </p>
        </div>
      </FullBleedScene>

      {/* ========================================================
          ESCENA B: ZOOM-THROUGH (300svh track, 100svh sticky viewport)
          ======================================================== */}
      <div
        ref={zoomThroughRef}
        className="relative min-h-[300svh] w-full bg-[#1F0E28] select-none"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(116,74,139,0.35)_0%,transparent_75%)]" />

          {/* Scene B Header text that fades as zoom progresses */}
          <motion.div
            style={{ opacity: shouldReduceMotion ? 1 : sceneBTextOpacity }}
            className="absolute top-12 sm:top-16 inset-x-0 z-20 text-center px-6 max-w-2xl mx-auto pointer-events-none"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] text-[#C7A8DF] font-semibold mb-2">
              <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
              <span>Recuerdos que crecen</span>
            </span>
            <p className="font-editorial-quote text-2xl sm:text-3xl text-white font-medium leading-snug">
              "{copy.travel.sceneB}"
            </p>
          </motion.div>

          {/* Central Zooming Photo (Foto 8) */}
          <motion.div
            style={{
              scale: shouldReduceMotion ? 1 : centerScale,
              borderRadius: shouldReduceMotion ? "0px" : centerBorderRadius,
              willChange: "transform",
            }}
            onClick={() => onPhotoClick(photo8)}
            className="relative w-full h-full max-w-full max-h-full overflow-hidden shadow-2xl cursor-pointer z-10 flex items-center justify-center"
          >
            <ImageWithFallback
              photo={photo8}
              aspectRatioClass="w-full h-full"
              className="w-full h-full rounded-none border-none object-cover"
            />
            {/* Scrim overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[rgba(28,14,36,0.65)] via-transparent to-[rgba(28,14,36,0.3)]" />
            <div className="absolute bottom-8 left-8 right-8 text-left z-20 pointer-events-none">
              <p className="font-serif italic text-lg sm:text-2xl text-white drop-shadow-sm">
                {photo8.caption}
              </p>
            </div>
          </motion.div>

          {/* Surrounding Collage Photos (Fotos 4, 11, 13) that scatter away */}
          {!shouldReduceMotion && (
            <>
              {/* Photo 4 - Top Left */}
              <motion.div
                style={{
                  x: p4X,
                  y: p4Y,
                  opacity: p4Opacity,
                  willChange: "transform, opacity",
                }}
                onClick={() => onPhotoClick(photo4)}
                className="absolute top-[18%] left-[8%] w-[38vw] sm:w-[240px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-15 cursor-pointer"
              >
                <ImageWithFallback
                  photo={photo4}
                  aspectRatioClass="h-full w-full"
                  className="h-full w-full rounded-2xl border-none"
                />
              </motion.div>

              {/* Photo 11 - Top Right */}
              <motion.div
                style={{
                  x: p11X,
                  y: p11Y,
                  opacity: p11Opacity,
                  willChange: "transform, opacity",
                }}
                onClick={() => onPhotoClick(photo11)}
                className="absolute top-[22%] right-[8%] w-[36vw] sm:w-[220px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-15 cursor-pointer"
              >
                <ImageWithFallback
                  photo={photo11}
                  aspectRatioClass="h-full w-full"
                  className="h-full w-full rounded-2xl border-none"
                />
              </motion.div>

              {/* Photo 13 - Bottom Right */}
              <motion.div
                style={{
                  x: p13X,
                  y: p13Y,
                  opacity: p13Opacity,
                  willChange: "transform, opacity",
                }}
                onClick={() => onPhotoClick(photo13)}
                className="absolute bottom-[16%] right-[10%] w-[42vw] sm:w-[260px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-15 cursor-pointer"
              >
                <ImageWithFallback
                  photo={photo13}
                  aspectRatioClass="h-full w-full"
                  className="h-full w-full rounded-2xl border-none"
                />
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================
          ESCENA C: Asymmetric Masonry Grid with <ClipReveal>
          ======================================================== */}
      <div className="py-28 sm:py-36 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeCinematic }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[#C7A8DF] font-semibold">
            <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
            <span>Cada instante</span>
          </span>
          <p className="font-editorial-quote text-2xl sm:text-3xl text-white font-medium leading-snug">
            "{copy.travel.sceneC}"
          </p>
        </motion.div>

        {/* Asymmetric Heights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {sceneCPhotos.map((photo, i) => {
            // Varied aspect ratios for authentic masonry rhythm
            const aspectClass =
              i % 3 === 0
                ? "aspect-[3/4]"
                : i % 3 === 1
                ? "aspect-[4/5]"
                : "aspect-[1/1]";

            return (
              <ClipReveal key={photo.id}>
                <div
                  onClick={() => onPhotoClick(photo)}
                  className="group relative rounded-3xl overflow-hidden p-2.5 bg-white/5 border border-white/10 shadow-xl cursor-pointer hover:border-[#C7A8DF]/50 transition-colors"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <ImageWithFallback
                      photo={photo}
                      aspectRatioClass={aspectClass}
                      className="rounded-2xl transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                  </div>
                  <div className="mt-3 px-2 flex items-center justify-between text-xs text-[#EADCF5]/80">
                    <span className="font-serif italic text-sm text-white break-words whitespace-normal pr-2 leading-relaxed">
                      {photo.caption}
                    </span>
                    <span className="text-[10px] text-[#C7A8DF] uppercase tracking-wider shrink-0">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </ClipReveal>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          ESCENA D: Full-Bleed Finale of Travel (Foto 23)
          ======================================================== */}
      <FullBleedScene
        photo={sceneDPhoto}
        heightVh={170}
        align="center"
        onClickPhoto={() => onPhotoClick(sceneDPhoto)}
      >
        <div ref={finaleMessageRef} className="max-w-2xl mx-auto text-center space-y-6 px-4">
          <button
            type="button"
            onClick={() => triggerCelebrationConfetti(Boolean(shouldReduceMotion))}
            title="¡Celebrar con confeti! ✨"
            className="inline-flex p-3.5 rounded-full bg-white/10 text-[#C7A8DF] backdrop-blur-md shadow-lg hover:bg-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-[#C62E4E] animate-sparkle group-hover:rotate-12 transition-transform" />
          </button>

          <h3 className="font-editorial-title text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-tight leading-snug drop-shadow-md text-balance">
            {copy.travel.closing}
          </h3>

          <div className="flex flex-col items-center justify-center gap-1.5 pt-2">
            <button
              type="button"
              onClick={() => triggerCelebrationConfetti(Boolean(shouldReduceMotion))}
              className="p-2.5 rounded-full hover:bg-white/15 active:scale-95 transition-all cursor-pointer group"
              title="¡Lanzar más confeti de celebración!"
            >
              <Heart className="w-5 h-5 text-[#C62E4E] fill-[#C62E4E] animate-pulse group-hover:scale-125 transition-transform" />
            </button>
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#C7A8DF]/80">
              Momento de celebración ✨
            </span>
          </div>
        </div>
      </FullBleedScene>
    </section>
  );
};
