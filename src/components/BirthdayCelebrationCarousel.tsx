import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, PawPrint } from "lucide-react";
import { copy } from "../content/copy";
import { galleryPhotos, BirthdayPhoto } from "../content/galleryData";
import { ImageWithFallback } from "./ImageWithFallback";
import { RevealText } from "./motion/RevealText";
import { spring, easeCinematic } from "../motion/presets";
import { triggerCelebrationConfetti } from "../utils/confettiCelebration";

interface BirthdayCelebrationCarouselProps {
  onPhotoClick: (photo: BirthdayPhoto) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  isPaw?: boolean;
}

export const BirthdayCelebrationCarousel: React.FC<BirthdayCelebrationCarouselProps> = ({
  onPhotoClick,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [tappedHearts, setTappedHearts] = useState<{ [key: number]: number }>({});
  const [floatingHearts, setFloatingHearts] = useState<{ [slideId: number]: FloatingHeart[] }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Finale Confetti Trigger for Carousel closure message
  const closureRef = useRef<HTMLDivElement>(null);
  const isClosureInView = useInView(closureRef, { once: true, amount: 0.5 });
  const hasTriggeredClosureConfettiRef = useRef(false);

  useEffect(() => {
    if (isClosureInView && !hasTriggeredClosureConfettiRef.current) {
      hasTriggeredClosureConfettiRef.current = true;
      const timer = setTimeout(() => {
        triggerCelebrationConfetti(Boolean(shouldReduceMotion));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isClosureInView, shouldReduceMotion]);

  const slidesData = copy.celebrationCarousel.slides;

  // Scroll to slide
  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const targetChild = carouselRef.current.children[index] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveSlide(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeSlide - 1);
    scrollToSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(slidesData.length - 1, activeSlide + 1);
    scrollToSlide(nextIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlide]);

  // Track active slide via scroll observer
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollPosition = el.scrollLeft + el.clientWidth / 2;
      const children = Array.from(el.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (
          scrollPosition >= child.offsetLeft &&
          scrollPosition <= child.offsetLeft + child.clientWidth
        ) {
          setActiveSlide(i);
          break;
        }
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeartTap = (slideId: number) => {
    setTappedHearts((prev) => ({
      ...prev,
      [slideId]: (prev[slideId] || 0) + 1,
    }));

    // Emit 6-8 floating hearts and paws with physics
    const count = 7;
    const newHearts: FloatingHeart[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 80,
      y: -(60 + Math.random() * 80),
      rotate: (Math.random() - 0.5) * 45,
      scale: 0.7 + Math.random() * 0.6,
      isPaw: i % 2 === 1,
    }));

    setFloatingHearts((prev) => ({
      ...prev,
      [slideId]: [...(prev[slideId] || []), ...newHearts],
    }));

    // Cleanup after animation completes
    setTimeout(() => {
      setFloatingHearts((prev) => ({
        ...prev,
        [slideId]: (prev[slideId] || []).filter((h) => !newHearts.some((nh) => nh.id === h.id)),
      }));
    }, 1200);
  };

  return (
    <section id="celebracion" className="relative pt-6 pb-20 space-y-12 select-none">
      {/* Chapter 2 Header - Subtitle only */}
      <div className="text-center max-w-2xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: easeCinematic }}
          className="text-base sm:text-lg font-light text-[#744A8B] leading-relaxed text-pretty"
        >
          {copy.celebrationCarousel.subtitle}
        </motion.p>
      </div>

      {/* Carousel Container with Progressive Scroll Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: easeCinematic }}
        className="relative max-w-7xl mx-auto px-2 sm:px-6"
      >
        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex items-center justify-between absolute top-1/2 -translate-y-1/2 left-2 right-2 pointer-events-none z-30">
          <button
            onClick={handlePrev}
            disabled={activeSlide === 0}
            aria-label="Diapositiva anterior"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md border border-[#C7A8DF]/40 text-[#382044] transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeSlide === slidesData.length - 1}
            aria-label="Diapositiva siguiente"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md border border-[#C7A8DF]/40 text-[#382044] transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll-Snap Track */}
        <div
          ref={carouselRef}
          className="carousel-snap flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 px-4 sm:px-12 no-scrollbar touch-pan-x"
          style={{ scrollbarWidth: "none" }}
        >
          {slidesData.map((slide, idx) => {
            const photo = galleryPhotos.find((p) => p.id === slide.photoId) || galleryPhotos[0];
            const tapCount = tappedHearts[slide.id] || 0;
            const wishText =
              copy.celebrationCarousel.microWishes[
                (tapCount - 1) % copy.celebrationCarousel.microWishes.length
              ];
            const isActive = idx === activeSlide;
            const slideHearts = floatingHearts[slide.id] || [];

            return (
              <motion.div
                key={slide.id}
                animate={{
                  scale: isActive ? 1 : 0.92,
                  opacity: isActive ? 1 : 0.6,
                  filter: isActive ? "brightness(1)" : "brightness(0.82)",
                }}
                transition={spring}
                className="carousel-slide flex-shrink-0 w-[84vw] sm:w-[380px] md:w-[420px] aspect-[4/5] max-h-[78svh] min-h-[440px] rounded-3xl overflow-hidden relative flex flex-col justify-between p-6 sm:p-7 shadow-xl select-none"
              >
                {/* Background Full Photo */}
                <div
                  onClick={() => onPhotoClick(photo)}
                  className="absolute inset-0 w-full h-full cursor-pointer z-0"
                >
                  <ImageWithFallback
                    photo={photo}
                    aspectRatioClass="h-full w-full"
                    className="h-full w-full rounded-none border-none"
                  />
                </div>

                {/* Scrim Gradient for legibility */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[rgba(28,14,36,0.4)] via-[rgba(28,14,36,0.3)] to-[rgba(28,14,36,0.92)]" />

                {/* Outline Big Number 01..08 */}
                <span className="absolute bottom-20 right-4 font-serif text-[clamp(6rem,14vw,9rem)] font-light text-stroke-outline opacity-35 select-none pointer-events-none leading-none z-10">
                  {String(slide.id).padStart(2, "0")}
                </span>

                {/* Top Editorial Metadata */}
                <div className="relative z-20 flex items-center justify-between text-xs text-white/90 font-medium tracking-wider">
                  <span className="inline-flex items-center gap-1.5 uppercase text-[11px] tracking-[0.25em] text-[#EADCF5]">
                    <PawPrint className="w-3 h-3 text-[#C62E4E] fill-[#C62E4E]" />
                    <span>Razón {String(slide.id).padStart(2, "0")} / 08</span>
                  </span>
                  <span className="text-[11px] text-[#C7A8DF] font-serif italic">
                    Para Vale
                  </span>
                </div>

                {/* Bottom Overlaid Text & Actions */}
                <div className="relative z-20 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-editorial-title text-2xl sm:text-3xl font-medium text-white leading-snug drop-shadow-sm">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#EADCF5]/90 font-light leading-relaxed max-w-sm drop-shadow-xs">
                      {slide.phrase}
                    </p>
                  </div>

                  {/* Interactive Heart Wish Button with floating SVG hearts */}
                  <div className="pt-3 border-t border-white/20 flex items-center justify-between relative">
                    {/* Floating SVG Hearts physics */}
                    <AnimatePresence>
                      {slideHearts.map((heart) => (
                        <motion.div
                          key={heart.id}
                          initial={{ opacity: 1, scale: 0.4, x: 0, y: 0 }}
                          animate={{
                            opacity: 0,
                            scale: heart.scale,
                            x: heart.x,
                            y: heart.y,
                            rotate: heart.rotate,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className="absolute left-6 bottom-4 pointer-events-none z-30"
                        >
                          {heart.isPaw ? (
                            <PawPrint className="w-5 h-5 text-[#C7A8DF] fill-[#C7A8DF] drop-shadow-md" />
                          ) : (
                            <Heart className="w-5 h-5 text-[#C62E4E] fill-[#C62E4E] drop-shadow-md" />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <button
                      onClick={() => handleHeartTap(slide.id)}
                      aria-label={slide.buttonLabel}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <Heart className={`w-3.5 h-3.5 ${tapCount > 0 ? "fill-[#C62E4E] text-[#C62E4E]" : "fill-white/80"}`} />
                      <span>{slide.buttonLabel}</span>
                      {tapCount > 0 && <span className="opacity-90 font-mono">({tapCount})</span>}
                    </button>

                    {tapCount > 0 && (
                      <span className="text-xs font-serif italic text-[#FAD2E1] animate-fade-in text-right">
                        {wishText}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6" aria-hidden="true">
          {slidesData.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a la dedicatoria ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeSlide ? "w-8 bg-[#C62E4E]" : "w-2 bg-[#C7A8DF]/50 hover:bg-[#C7A8DF]"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Fullscreen Emotional Carousel Closure on deep plum background */}
      <div
        ref={closureRef}
        className="relative bg-[#382044] text-white py-24 sm:py-32 px-6 sm:px-12 text-center overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(116,74,139,0.3)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <button
            type="button"
            onClick={() => triggerCelebrationConfetti(Boolean(shouldReduceMotion))}
            title="¡Celebrar con confeti! ✨"
            className="p-3 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer group mx-auto inline-flex"
          >
            <Heart className="w-6 h-6 text-[#C62E4E] fill-[#C62E4E] animate-pulse group-hover:scale-125 transition-transform" />
          </button>

          <RevealText
            text={`"${copy.celebrationCarousel.closing}"`}
            as="p"
            by="lines"
            className="font-editorial-quote text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-snug text-balance"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs tracking-[0.3em] uppercase text-[#C7A8DF] font-semibold pt-4"
          >
            Y por eso...
          </motion.p>
        </div>
      </div>
    </section>
  );
};
