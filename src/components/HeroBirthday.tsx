import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, Sparkles, PawPrint } from "lucide-react";
import { copy } from "../content/copy";
import { galleryPhotos, BirthdayPhoto } from "../content/galleryData";
import { ImageWithFallback } from "./ImageWithFallback";
import { KenBurns } from "./motion/KenBurns";
import { RevealText } from "./motion/RevealText";
import { easeCinematic } from "../motion/presets";

interface HeroBirthdayProps {
  onPhotoClick: (photo: BirthdayPhoto) => void;
  onScrollToCelebration: () => void;
}

export const HeroBirthday: React.FC<HeroBirthdayProps> = ({
  onPhotoClick,
  onScrollToCelebration,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const heroPhoto = galleryPhotos.find((p) => p.id === 9) || galleryPhotos[0];
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Photo zooms out from 1.15 to 1.0 as user scrolls (completes at 0.9)
  const photoScale = useTransform(scrollYProgress, [0, 0.9], [1.15, 1.0]);

  // Headline rises with 0.5x parallax and fades out between 0 and 0.6
  const headlineY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-30%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Tag letter-spacing animation: 0.6em -> 0.25em
  const tagLetterSpacing = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["0.55em", "0.22em"]
  );

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative min-h-[150svh] w-full select-none"
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between">
        {/* Full-Bleed Photo Background with Ken Burns & Scroll Zoom-out */}
        <motion.div
          style={{
            scale: shouldReduceMotion ? 1 : photoScale,
            willChange: "transform",
          }}
          className="absolute inset-0 w-full h-full"
        >
          <KenBurns directionIndex={0} className="w-full h-full">
            <div
              onClick={() => onPhotoClick(heroPhoto)}
              className="w-full h-full cursor-pointer"
            >
              <ImageWithFallback
                photo={heroPhoto}
                priority={true}
                aspectRatioClass="h-full w-full"
                className="h-full w-full rounded-none border-none"
              />
            </div>
          </KenBurns>
        </motion.div>

        {/* Cinematic Scrim Gradient (top translucent to deep bottom plum) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[rgba(28,14,36,0.32)] via-[rgba(28,14,36,0.52)] to-[rgba(28,14,36,0.88)]" />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none vignette-scrim" />

        {/* Top Tag Area */}
        <div className="relative z-10 pt-16 sm:pt-20 px-6 sm:px-12 max-w-5xl mx-auto w-full text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeCinematic }}
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase text-[#C7A8DF] py-1.5 px-3.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/10"
          >
            <PawPrint className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
            <motion.span
              style={{
                letterSpacing: shouldReduceMotion ? "0.25em" : tagLetterSpacing,
              }}
            >
              {copy.hero.tag}
            </motion.span>
            <Sparkles className="w-3.5 h-3.5 text-[#C7A8DF] animate-sparkle" />
          </motion.div>
        </div>

        {/* Central / Bottom Editorial Headline Content */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : headlineY,
            opacity: shouldReduceMotion ? 1 : headlineOpacity,
          }}
          className="relative z-10 max-w-4xl px-6 sm:px-12 lg:px-16 pb-12 sm:pb-16 text-left text-white space-y-4"
        >
          <div className="space-y-2">
            <RevealText
              text={copy.hero.title}
              as="h1"
              by="words"
              className="font-chapter-hero font-normal text-white drop-shadow-md text-balance"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: easeCinematic }}
              className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#EADCF5] font-light leading-snug drop-shadow-xs"
            >
              {copy.hero.subtitle}
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: easeCinematic }}
            className="text-sm sm:text-base lg:text-lg font-light text-[#EADCF5]/85 leading-relaxed max-w-xl"
          >
            {copy.hero.complementary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: easeCinematic }}
            className="pl-3.5 border-l-2 border-[#C62E4E] max-w-lg pt-0.5"
          >
            <p className="font-editorial-quote text-base sm:text-lg lg:text-xl text-white/95 leading-snug">
              "{copy.hero.quote}"
            </p>
          </motion.div>

          {/* Action CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: easeCinematic }}
            className="pt-2 flex items-center gap-4"
          >
            <button
              onClick={onScrollToCelebration}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C62E4E] hover:bg-[#d8355a] text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C7A8DF]"
            >
              <span>{copy.hero.cta}</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Looping Vertical Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center pb-6 pointer-events-none">
          <div className="relative w-px h-12 bg-white/20 overflow-hidden">
            <motion.div
              animate={{
                y: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-1/2 bg-gradient-to-b from-transparent via-[#C62E4E] to-white"
            />
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#C7A8DF]/70 pt-1">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};
