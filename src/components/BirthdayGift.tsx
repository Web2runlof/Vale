import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import confetti from "canvas-confetti";
import { Gift, Heart, Send, Copy, Check, RotateCcw, Sparkles, PawPrint, Camera, Upload } from "lucide-react";
import { copy } from "../content/copy";
import { birthdayConfig } from "../content/birthdayConfig";
import { galleryPhotos, BirthdayPhoto } from "../content/galleryData";
import { DateSelector } from "./DateSelector";
import { ImageWithFallback } from "./ImageWithFallback";
import { SecondGift } from "./SecondGift";
import { KenBurns } from "./motion/KenBurns";
import { FullBleedScene } from "./motion/FullBleedScene";
import { ParallaxImage } from "./motion/ParallaxImage";
import { RevealText } from "./motion/RevealText";
import { easeCinematic } from "../motion/presets";

interface BirthdayGiftProps {
  onPhotoClick: (photo: BirthdayPhoto) => void;
  onScrollToTop: () => void;
}

export const BirthdayGift: React.FC<BirthdayGiftProps> = ({
  onPhotoClick,
  onScrollToTop,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vale_gift_revealed") === "true";
    } catch {
      return false;
    }
  });

  const [isOpeningAnim, setIsOpeningAnim] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem("vale_gift_date") || null;
    } catch {
      return null;
    }
  });

  const [formattedDateText, setFormattedDateText] = useState<string>(() => {
    try {
      return localStorage.getItem("vale_gift_date_text") || "";
    } catch {
      return "";
    }
  });

  const [isConfirmed, setIsConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vale_gift_confirmed") === "true";
    } catch {
      return false;
    }
  });

  const [customBg, setCustomBg] = useState<string | null>(() => {
    try {
      return localStorage.getItem("vale_gift_custom_bg") || null;
    } catch {
      return null;
    }
  });

  const [copied, setCopied] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Closing photo is Foto 28 (or custom uploaded background)
  const baseClosingPhoto =
    galleryPhotos.find((p) => p.id === 28) || galleryPhotos[galleryPhotos.length - 1];

  const activeClosingPhoto: BirthdayPhoto = customBg
    ? {
        id: 9999,
        src: customBg,
        originalFilename: "foto-personalizada-cumple.jpg",
        alt: "Foto de fondo personalizada de Vale",
        category: "closing",
        caption: "Tu foto de fondo personalizada",
      }
    : baseClosingPhoto;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomBg(result);
          try {
            localStorage.setItem("vale_gift_custom_bg", result);
          } catch {}
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = () => {
    setCustomBg(null);
    try {
      localStorage.removeItem("vale_gift_custom_bg");
    } catch {}
  };

  // Secondary shared closing photos (Fotos 25, 26, 27)
  const sharedPhoto25 = galleryPhotos.find((p) => p.id === 25);
  const sharedPhoto26 = galleryPhotos.find((p) => p.id === 26);
  const sharedPhoto27 = galleryPhotos.find((p) => p.id === 27);

  // Finale section detection for celebratory confetti explosion
  const finaleRef = useRef<HTMLDivElement>(null);
  const isFinaleInView = useInView(finaleRef, { once: true, amount: 0.35 });
  const hasExplodedRef = useRef<boolean>(false);

  const triggerFinalConfetti = () => {
    try {
      // Left cannon burst
      confetti({
        particleCount: shouldReduceMotion ? 30 : 65,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.75 },
        colors: ["#C62E4E", "#741C3C", "#C7A8DF", "#F7E7CE", "#FAF0F4"],
      });

      // Right cannon burst
      confetti({
        particleCount: shouldReduceMotion ? 30 : 65,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.75 },
        colors: ["#C62E4E", "#741C3C", "#C7A8DF", "#F7E7CE", "#FAF0F4"],
      });

      // Overhead grand cascade
      if (!shouldReduceMotion) {
        setTimeout(() => {
          try {
            confetti({
              particleCount: 85,
              spread: 110,
              origin: { x: 0.5, y: 0.45 },
              colors: ["#C62E4E", "#744A8B", "#C7A8DF", "#F7E7CE", "#EADCF5"],
            });
          } catch {}
        }, 320);
      }
    } catch {
      // Confetti fallback
    }
  };

  useEffect(() => {
    if (isFinaleInView && !hasExplodedRef.current) {
      hasExplodedRef.current = true;
      triggerFinalConfetti();
    }
  }, [isFinaleInView, shouldReduceMotion]);

  const handleOpenGift = () => {
    setIsOpeningAnim(true);
    setIsOpen(true);
    try {
      localStorage.setItem("vale_gift_revealed", "true");
    } catch {}

    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#C62E4E", "#744A8B", "#C7A8DF", "#F7E7CE", "#EADCF5"],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      setIsOpeningAnim(false);
    }, 1100);
  };

  const handleSelectDate = (isoDate: string, formattedText: string) => {
    setSelectedDate(isoDate);
    setFormattedDateText(formattedText);
    try {
      localStorage.setItem("vale_gift_date", isoDate);
      localStorage.setItem("vale_gift_date_text", formattedText);
    } catch {}
  };

  const handleConfirmPlan = () => {
    if (!selectedDate) return;
    setIsConfirmed(true);
    try {
      localStorage.setItem("vale_gift_confirmed", "true");
    } catch {}

    try {
      confetti({
        particleCount: 100,
        spread: 95,
        origin: { y: 0.7 },
        colors: ["#C62E4E", "#741C3C", "#C7A8DF", "#F7E7CE"],
      });
    } catch {
      // Confetti fallback
    }
  };

  const messageForPartner = `Amorcito ❤️ Ya elegí nuestra fecha para el brunch sorpresa de cumpleaños: ${
    formattedDateText || selectedDate
  }. ¡Qué emoción celebrar juntos!`;

  const handleWhatsAppClick = () => {
    const phone = birthdayConfig.gift.recipientWhatsApp.replace(/\D/g, "");
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageForPartner)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageForPartner).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <section id="regalo" className={`relative pt-6 ${isOpen ? "pb-0" : "pb-24 sm:pb-28"} transition-colors duration-1000 select-none`}>
      {/* ========================================================
          STATE 1: PRE-REVEAL (Deep Plum background with gift CTA)
          ======================================================== */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: easeCinematic }}
          className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#382044] via-[#2A1535] to-[#382044] text-white rounded-3xl mx-4 sm:mx-6 p-8 sm:p-16 card-border shadow-2xl overflow-hidden"
        >
          <div className="relative mb-5 flex items-center justify-center gap-2">
            <PawPrint className="w-5 h-5 text-[#C7A8DF]/70 fill-[#C7A8DF]/40 -rotate-12" />
            <Heart className="w-6 h-6 text-[#C62E4E] fill-[#C62E4E] animate-bounce" />
            <PawPrint className="w-5 h-5 text-[#C7A8DF]/70 fill-[#C7A8DF]/40 rotate-12" />
          </div>

          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C7A8DF] mb-2">
            {copy.gift.tag}
          </span>

          <p className="text-base sm:text-lg text-[#EADCF5]/85 font-light">
            {copy.gift.preReveal.text1}
          </p>

          <p className="mt-1 text-sm sm:text-base text-[#C7A8DF] font-serif italic">
            "{copy.gift.preReveal.text2}"
          </p>

          <h2 className="mt-6 font-editorial-title text-3xl sm:text-4xl lg:text-5xl max-w-xl text-balance font-normal leading-tight text-white">
            {copy.gift.preReveal.hero}
          </h2>

          {/* Interactive Gift Button */}
          <div className="mt-10">
            <button
              onClick={handleOpenGift}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#C62E4E] to-[#741C3C] text-white font-medium text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C7A8DF]"
            >
              <Gift className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span>{copy.gift.preReveal.openCta}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* ========================================================
            STATE 2: REVEALED GIFT EXPERIENCE
            Curtain open + 3D flip card + Calendar + Photos 25-27 + FullBleed 28
            ======================================================== */
        <div className="relative space-y-16 sm:space-y-20 overflow-x-clip">
          {/* Two-half curtain opening transition */}
          <AnimatePresence>
            {isOpeningAnim && !shouldReduceMotion && (
              <div className="fixed inset-0 z-50 pointer-events-none flex">
                <motion.div
                  initial={{ x: "0%" }}
                  animate={{ x: "-100%" }}
                  transition={{ duration: 1.1, ease: easeCinematic }}
                  className="w-1/2 h-full bg-[#382044] border-r border-[#C7A8DF]/20 shadow-2xl"
                />
                <motion.div
                  initial={{ x: "0%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.1, ease: easeCinematic }}
                  className="w-1/2 h-full bg-[#382044] border-l border-[#C7A8DF]/20 shadow-2xl"
                />
              </div>
            )}
          </AnimatePresence>

          {/* Main 3D Flip Card Container */}
          <div
            style={{ perspective: 1400 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { rotateY: 90, opacity: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { rotateY: 0, opacity: 1 }
              }
              transition={{ duration: 1.1, ease: easeCinematic }}
              style={{ transformStyle: "preserve-3d" }}
              className="rounded-3xl p-6 sm:p-12 lg:p-16 bg-white card-border paper-shadow text-center relative overflow-hidden"
            >
              {/* Corner watermark paws */}
              <div className="absolute -top-3 -right-3 text-[#744A8B]/10 rotate-15 pointer-events-none select-none">
                <PawPrint className="w-24 h-24 fill-[#744A8B]/10" />
              </div>
              <div className="absolute -bottom-3 -left-3 text-[#744A8B]/10 -rotate-15 pointer-events-none select-none">
                <PawPrint className="w-24 h-24 fill-[#744A8B]/10" />
              </div>

              {/* Soft decorative aura */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#EADCF5]/50 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#744A8B] mb-3">
                  <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
                  <span>La Gran Sorpresa de Cumpleaños</span>
                  <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
                </div>

                <h2 className="font-editorial-title text-3xl sm:text-4xl lg:text-5xl text-[#382044] font-medium leading-tight">
                  {copy.gift.revealed.title}
                </h2>

                <p className="mt-3 font-serif italic text-xl sm:text-2xl text-[#C62E4E]">
                  {copy.gift.revealed.subtitle}
                </p>

                <p className="mt-5 text-base sm:text-lg text-[#744A8B] font-light leading-relaxed">
                  {copy.gift.revealed.body}
                </p>

                {/* Hero Statement */}
                <div className="my-8 py-4 px-6 rounded-2xl bg-[#FDF8FC] border border-[#C7A8DF]/40">
                  <p className="font-editorial-quote text-xl sm:text-2xl text-[#741C3C] font-semibold">
                    "{copy.gift.revealed.heroStatement}"
                  </p>
                </div>

                {/* Date Selection Flow */}
                {!isConfirmed ? (
                  <div className="mt-10 space-y-6">
                    <h3 className="font-editorial-title text-xl text-[#382044]">
                      {copy.gift.revealed.calendarPrompt}
                    </h3>

                    {/* Calendar Component */}
                    <DateSelector
                      selectedDate={selectedDate}
                      onSelectDate={handleSelectDate}
                    />

                    {/* Confirm Button */}
                    {selectedDate && (
                      <div className="pt-4 animate-fade-in">
                        <button
                          onClick={handleConfirmPlan}
                          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#741C3C] hover:bg-[#C62E4E] text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                        >
                          <Heart className="w-4 h-4 fill-white" />
                          <span>{copy.gift.revealed.confirmCta}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Confirmed State */
                  <div className="mt-10 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#FAF2F7] to-[#F5EBF9] border border-[#C62E4E]/30 animate-fade-in">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-white shadow-sm text-[#C62E4E]">
                        <Heart className="w-6 h-6 fill-current" />
                      </div>
                    </div>

                    <h3 className="font-editorial-title text-2xl sm:text-3xl text-[#741C3C] font-semibold">
                      {copy.gift.confirmed.title}
                    </h3>

                    <p className="mt-2 text-base sm:text-lg text-[#382044]">
                      {copy.gift.confirmed.leadPrefix}{" "}
                      <strong className="font-serif italic font-semibold text-[#741C3C]">
                        {formattedDateText || selectedDate}
                      </strong>
                      .
                    </p>

                    <p className="mt-3 text-sm text-[#744A8B] font-light">
                      {copy.gift.confirmed.closing}
                    </p>

                    {/* WhatsApp or Clipboard Action */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                      {birthdayConfig.gift.recipientWhatsApp ? (
                        <button
                          onClick={handleWhatsAppClick}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-colors shadow-sm cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{copy.gift.confirmed.whatsappCta}</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleCopyMessage}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#741C3C] text-white text-sm font-medium hover:bg-[#C62E4E] transition-colors shadow-sm cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300" />
                              <span>¡Copiado con amor!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>{copy.gift.confirmed.copyCta}</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => setIsConfirmed(false)}
                        className="text-xs text-[#744A8B] underline underline-offset-4 hover:text-[#741C3C] py-2 px-3 cursor-pointer"
                      >
                        Elegir otra fecha
                      </button>
                    </div>

                    {copied && (
                      <p className="mt-3 text-xs text-[#C62E4E] animate-fade-in font-medium">
                        {copy.gift.confirmed.copiedNotice}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Second Gift Section (Cirugía de ojos) */}
          {isConfirmed && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SecondGift />
            </div>
          )}

          {/* ========================================================
              SHARED PHOTOS (Fotos 25, 26, 27) Staggered Parallax Composition
              ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, ease: easeCinematic }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#744A8B]">
              Celebrando cada paso juntos
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-center">
              {sharedPhoto25 && (
                <ParallaxImage speed={0.8} className="rounded-3xl p-3 bg-white card-border shadow-lg">
                  <div onClick={() => onPhotoClick(sharedPhoto25)} className="cursor-pointer">
                    <ImageWithFallback
                      photo={sharedPhoto25}
                      aspectRatioClass="aspect-[4/3]"
                      className="rounded-2xl"
                    />
                    <p className="mt-3 text-sm font-serif italic text-[#382044]">
                      {sharedPhoto25.caption}
                    </p>
                  </div>
                </ParallaxImage>
              )}

              {sharedPhoto26 && (
                <ParallaxImage speed={1.3} className="rounded-3xl p-3 bg-white card-border shadow-xl sm:-translate-y-6">
                  <div onClick={() => onPhotoClick(sharedPhoto26)} className="cursor-pointer">
                    <ImageWithFallback
                      photo={sharedPhoto26}
                      aspectRatioClass="aspect-[3/4]"
                      className="rounded-2xl"
                    />
                    <p className="mt-3 text-sm font-serif italic text-[#741C3C] font-semibold">
                      {sharedPhoto26.caption}
                    </p>
                  </div>
                </ParallaxImage>
              )}

              {sharedPhoto27 && (
                <ParallaxImage speed={0.9} className="rounded-3xl p-3 bg-white card-border shadow-lg">
                  <div onClick={() => onPhotoClick(sharedPhoto27)} className="cursor-pointer">
                    <ImageWithFallback
                      photo={sharedPhoto27}
                      aspectRatioClass="aspect-[4/3]"
                      className="rounded-2xl"
                    />
                    <p className="mt-3 text-sm font-serif italic text-[#382044]">
                      {sharedPhoto27.caption}
                    </p>
                  </div>
                </ParallaxImage>
              )}
            </div>
          </motion.div>

          {/* ========================================================
              FINAL FULL-BLEED SCENE (Foto 28 or Custom Bg)
              ======================================================== */}
          {activeClosingPhoto && (
            <div
              ref={finaleRef}
              id="final-de-la-experiencia"
              className="relative w-full min-h-[90svh] sm:min-h-[100svh] flex items-center justify-center overflow-hidden select-none"
            >
              {/* Background Photo with gentle KenBurns motion */}
              <div className="absolute inset-0 w-full h-full">
                <KenBurns directionIndex={2} className="w-full h-full">
                  <div
                    onClick={() => onPhotoClick(activeClosingPhoto)}
                    className="w-full h-full cursor-pointer"
                  >
                    <ImageWithFallback
                      photo={activeClosingPhoto}
                      aspectRatioClass="h-full w-full"
                      className="h-full w-full rounded-none border-none object-cover"
                    />
                  </div>
                </KenBurns>
              </div>

              {/* Cinematic Scrim Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(28,14,36,0.45)] via-[rgba(28,14,36,0.65)] to-[rgba(28,14,36,0.92)] pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none vignette-scrim" />

              {/* Editorial Text Content overlay */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: easeCinematic }}
                className="relative z-10 max-w-2xl mx-auto text-center space-y-7 px-4 py-16 sm:py-20"
              >
                <RevealText
                  text={copy.gift.finalClosure.title}
                  as="h3"
                  by="words"
                  className="font-editorial-title text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight drop-shadow-lg text-balance"
                />

                <p className="font-editorial-quote text-2xl sm:text-3xl text-[#EADCF5] leading-relaxed drop-shadow-md max-w-xl mx-auto italic">
                  "{copy.gift.finalClosure.subtitle}"
                </p>

                {/* "Te amo, Vale. ❤️" appearing smoothly */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.0, delay: 0.6, ease: easeCinematic }}
                  className="pt-2"
                >
                  <p className="font-editorial-title text-3xl sm:text-4xl lg:text-5xl text-[#FAD2E1] font-medium drop-shadow-lg">
                    {copy.gift.finalClosure.postscript}
                  </p>
                </motion.div>

                <div className="pt-2 flex justify-center">
                  <Heart className="w-6 h-6 text-[#C62E4E] fill-[#C62E4E] animate-pulse" />
                </div>

                {/* Background Photo Upload & Controls */}
                <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 text-xs font-medium text-white/95 hover:text-white bg-white/20 hover:bg-white/30 transition-all py-2.5 px-5 rounded-full backdrop-blur-md cursor-pointer border border-white/30 shadow-lg active:scale-95"
                    title="Sube una imagen desde tus archivos para cambiar la foto de fondo de esta sección"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FAD2E1]" />
                    <span>{customBg ? "Cambiar foto de fondo" : "Subir foto de fondo"}</span>
                  </button>

                  {customBg && (
                    <button
                      onClick={handleResetBg}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white bg-black/40 hover:bg-black/60 transition-all py-2.5 px-4 rounded-full backdrop-blur-md cursor-pointer border border-white/15"
                    >
                      <span>Restablecer foto original</span>
                    </button>
                  )}

                  <button
                    onClick={onScrollToTop}
                    className="inline-flex items-center gap-2 text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-all py-2.5 px-5 rounded-full backdrop-blur-md cursor-pointer shadow-md border border-white/15"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{copy.gift.finalClosure.backToStart}</span>
                  </button>

                  {/* Hidden file input triggered by upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
