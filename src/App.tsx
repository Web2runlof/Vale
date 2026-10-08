import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { galleryPhotos, BirthdayPhoto } from "./content/galleryData";
import { HeartGate } from "./components/HeartGate";
import { NavigationControls } from "./components/NavigationControls";
import { HeroBirthday } from "./components/HeroBirthday";
import { BirthdayCelebrationCarousel } from "./components/BirthdayCelebrationCarousel";
import { TravelStory } from "./components/TravelStory";
import { LoveLetter } from "./components/LoveLetter";
import { MemoriesSection } from "./components/MemoriesSection";
import { BirthdayGift } from "./components/BirthdayGift";
import { BirthdayCountdown2027 } from "./components/BirthdayCountdown2027";
import { InteractiveQuiz } from "./components/InteractiveQuiz";
import { PhotoLightbox } from "./components/PhotoLightbox";
import { MusicController } from "./components/MusicController";
import { ChapterTransition } from "./components/motion/ChapterTransition";
import { ScrollReveal } from "./components/motion/ScrollReveal";
import { AmbientPawPrints } from "./components/ui/AmbientPawPrints";
import { Heart, Sparkles, PawPrint } from "lucide-react";

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("vale_unlocked") === "true";
    } catch {
      return false;
    }
  });
  const [selectedPhoto, setSelectedPhoto] = useState<BirthdayPhoto | null>(null);
  const [isMediaActive, setIsMediaActive] = useState<boolean>(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    try {
      sessionStorage.setItem("vale_unlocked", "true");
    } catch {}
  };

  const handleRestart = () => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem("vale_unlocked");
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDF8FC] text-[#392C40] selection:bg-[#EADCF5] selection:text-[#382044] overflow-x-clip">
      {/* Global Film Grain Layer (SVG feTurbulence data-URI) */}
      <div className="film-grain" aria-hidden="true" />

      {/* Chapter 0: 5-Taps Heart Gate with smooth AnimatePresence crossfade */}
      <AnimatePresence mode="sync">
        {!isUnlocked && (
          <HeartGate key="heart-gate" onUnlock={handleUnlock} />
        )}
      </AnimatePresence>

      {/* Main Experience Rendered Once Unlocked */}
      {isUnlocked && (
        <motion.div
          key="main-experience"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col min-h-screen"
        >
          {/* Top navigation with spring progress indicator */}
          <NavigationControls
            onRestartExperience={handleRestart}
            onScrollTo={scrollToSection}
          />

          <main className="relative flex-1 w-full overflow-x-clip">
            <AmbientPawPrints />
            {/* Chapter 1: Portada Protagonista (Foto 9 & Birthday Greeting) */}
          <HeroBirthday
            onPhotoClick={(photo) => setSelectedPhoto(photo)}
            onScrollToCelebration={() => scrollToSection("transicion-2")}
          />

          {/* Transition: Slid over hero as card with -12svh, z-10, rounded-t and upward shadow */}
          <div
            id="transicion-2"
            className="relative z-10 -mt-[12svh] rounded-t-[2.5rem] shadow-[0_-20px_50px_-15px_rgba(56,32,68,0.12)] bg-[#FDF8FC]"
          >
            <ChapterTransition
              eyebrow="Razones para celebrar"
              title="Un poquito de ti. Muchísimas razones."
              quote="Porque el mundo es mucho más bonito contigo en él."
              theme="light"
              className="rounded-t-[2.5rem]"
            />
          </div>

          {/* Birthday Celebration Carousel (8 Dedications with Photos) */}
          <ScrollReveal>
            <BirthdayCelebrationCarousel
              onPhotoClick={(photo) => setSelectedPhoto(photo)}
            />
          </ScrollReveal>

          {/* Transition: Viajes */}
          <ChapterTransition
            eyebrow="Viajes & Naturaleza"
            title="Coleccionando el mundo juntos"
            quote="De las aventuras espontáneas y los atardeceres inolvidables."
            theme="dark"
          />

          {/* Travel Story */}
          <TravelStory onPhotoClick={(photo) => setSelectedPhoto(photo)} />

          {/* Transition: Carta (Capítulo IV) with ParticleField */}
          <ChapterTransition
            eyebrow="Carta íntima"
            title="Palabras que vienen del alma"
            quote="Para ti, amorcito mío de mi corazón."
            theme="dark"
            withParticles
          />

          {/* Love Letter (Preserved 100% Verbatim) */}
          <LoveLetter onPhotoClick={(photo) => setSelectedPhoto(photo)} />

          {/* Optional Quiz Component (kept inactive by default unless enabled in config) */}
          <InteractiveQuiz />

          {/* Transition: Recuerdos */}
          <ChapterTransition
            eyebrow="Recuerdos en movimiento"
            title="Risas, voz y momentos que brillan"
            quote="La felicidad también se ve y se escucha así."
            theme="light"
          />

          {/* Birthday Audio Message & 4 Vertical Videos */}
          <ScrollReveal>
            <MemoriesSection
              onAudioStart={() => setIsMediaActive(true)}
              onAudioEnd={() => setIsMediaActive(false)}
              onVideoPlay={() => setIsMediaActive(true)}
              onVideoPause={() => setIsMediaActive(false)}
              onProceedToGift={() => scrollToSection("transicion-6")}
            />
          </ScrollReveal>

          {/* Transition: Sorpresa */}
          <div id="transicion-6">
            <ChapterTransition
              eyebrow="La Gran Sorpresa"
              title="Tenemos una cita de cumpleaños"
              quote="Porque celebrarte apenas comienza..."
              theme="dark"
            />
          </div>

          {/* The Final Birthday Surprise (Curtain reveal, Calendar & Closing Photos) */}
          <BirthdayGift
            onPhotoClick={(photo) => setSelectedPhoto(photo)}
            onScrollToTop={() => scrollToSection("inicio")}
          />

          {/* Countdown section to next birthday: 12 de Octubre de 2027 */}
          <ScrollReveal>
            <BirthdayCountdown2027
              onPhotoClick={(photo) => setSelectedPhoto(photo)}
            />
          </ScrollReveal>
        </main>

        {/* Ambient Music Controller */}
        <MusicController isSuppressed={isMediaActive} />

        {/* Fullscreen Photo Lightbox with shared layout, drag gestures & crossfade */}
        <PhotoLightbox
          photo={selectedPhoto}
          photos={galleryPhotos}
          onClose={() => setSelectedPhoto(null)}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />

        {/* Editorial Birthday Footer with Progressive Entrance */}
        <ScrollReveal y={20} duration={0.85}>
          <footer className="mt-0 border-t border-white/10 py-10 px-4 text-center bg-[#13081A] text-white/80">
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-[#C7A8DF] font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#C62E4E]" />
                <span>VALE · QUÉ BONITO COINCIDIR CONTIGO</span>
                <PawPrint className="w-3.5 h-3.5 text-[#C7A8DF] fill-[#C7A8DF]" />
                <Heart className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
              </div>
              <p className="font-editorial-quote text-lg text-[#EADCF5] italic">
                "Hoy y siempre, celebrando la mujer maravillosa que eres."
              </p>
              <p className="text-[11px] text-[#C7A8DF]/70 font-sans tracking-wide">
                12 de Octubre · Tu cumpleaños especial
              </p>
            </div>
          </footer>
        </ScrollReveal>
      </motion.div>
      )}
    </div>
  );
}

export default App;
