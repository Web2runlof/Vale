import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Eye, Send, Copy, Check, Heart, Sparkles, Calendar, Clock } from "lucide-react";
import { copy } from "../content/copy";
import { birthdayConfig } from "../content/birthdayConfig";
import { easeCinematic } from "../motion/presets";

const DAYS_OPTIONS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const SLOTS_OPTIONS = ["Mañana", "Mediodía", "Tarde"];

export const SecondGift: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vale_second_gift_open") === "true";
    } catch {
      return false;
    }
  });

  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("vale_second_gift_days");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedSlots, setSelectedSlots] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("vale_second_gift_slots");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem("vale_second_gift_notes") || "";
    } catch {
      return "";
    }
  });

  const [copied, setCopied] = useState<boolean>(false);

  // Timeline scroll line animation
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleOpen = () => {
    setIsOpen(true);
    try {
      localStorage.setItem("vale_second_gift_open", "true");
    } catch {}
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const updated = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      try {
        localStorage.setItem("vale_second_gift_days", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) => {
      const updated = prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot];
      try {
        localStorage.setItem("vale_second_gift_slots", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    try {
      localStorage.setItem("vale_second_gift_notes", val);
    } catch {}
  };

  const formatList = (items: string[]) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} y ${items[1]}`;
    return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
  };

  const isShareEnabled = selectedDays.length > 0 && selectedSlots.length > 0;

  const buildMessage = () => {
    const daysText = formatList(selectedDays);
    const slotsText = formatList(selectedSlots);
    const notesText = notes.trim() ? ` ${notes.trim()}` : "";
    return `Amorcito, para las citas de mi cirugía tengo disponibles: ${daysText} en la ${slotsText}.${notesText}`;
  };

  const handleWhatsAppShare = () => {
    if (!isShareEnabled) return;
    const phone = birthdayConfig.gift.recipientWhatsApp.replace(/\D/g, "");
    if (!phone) return;
    const message = buildMessage();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyShare = () => {
    if (!isShareEnabled) return;
    const message = buildMessage();
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    });
  };

  return (
    <div className="w-full my-8 sm:my-12">
      {/* ========================================================
          STATE 1: REVEAL CTA BUTTON (Before opening)
          ======================================================== */}
      {!isOpen ? (
        <div className="flex justify-center py-6">
          <motion.button
            onClick={handleOpen}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#C62E4E] via-[#741C3C] to-[#382044] text-white font-medium text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C7A8DF]"
          >
            {/* Subtle glowing halo */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#C62E4E] to-[#C7A8DF] opacity-40 blur-sm group-hover:opacity-75 transition-opacity" />

            <span className="relative flex items-center gap-3">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-[#F7E7CE] animate-pulse" />
              <span className="tracking-wide">
                {copy.gift.secondGift.revealCta}
              </span>
              <Sparkles className="w-4 h-4 text-[#F7E7CE]/90" />
            </span>
          </motion.button>
        </div>
      ) : (
        /* ========================================================
            STATE 2: OPENED SECOND GIFT SECTION
            Card full width with #2A1535 to #382044 background
            ======================================================== */
        <AnimatePresence>
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 25, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: easeCinematic }}
            className="w-full bg-gradient-to-b from-[#2A1535] to-[#382044] text-white rounded-[2rem] p-6 sm:p-12 lg:p-16 border border-[#C7A8DF]/25 shadow-2xl relative overflow-hidden text-center"
          >
            {/* Soft decorative background glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C62E4E]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#744A8B]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle camera aperture/lens ring behind the title */}
            <div className="absolute top-12 sm:top-16 inset-x-0 flex justify-center pointer-events-none">
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 0.25, scale: 1 }
                    : { opacity: 0, scale: 1.3 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.25 }
                    : { opacity: [0, 0.45, 0.25], scale: 1 }
                }
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#C7A8DF]/25 flex items-center justify-center"
              >
                <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-dashed border-[#F7E7CE]/20" />
              </motion.div>
            </div>

            {/* Header Content Staggered */}
            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Eyebrow */}
              <motion.div
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0F4]/10 border border-[#C7A8DF]/30 text-xs font-semibold tracking-[0.25em] uppercase text-[#C7A8DF] mb-4"
              >
                <Eye className="w-3.5 h-3.5 text-[#F7E7CE]" />
                <span>{copy.gift.secondGift.eyebrow}</span>
              </motion.div>

              {/* Pre statement */}
              <motion.p
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-lg text-[#EADCF5]/85 font-light"
              >
                {copy.gift.secondGift.pre}
              </motion.p>

              {/* Title with Eye Focus Blur Effect (14px blur to 0, 1.04 scale to 1 over 1.6s) */}
              <motion.h2
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { filter: "blur(14px)", scale: 1.04, opacity: 0.2 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { filter: "blur(0px)", scale: 1, opacity: 1 }
                }
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 font-editorial-title text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-white text-balance"
              >
                {copy.gift.secondGift.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 }}
                className="mt-3 font-serif italic text-xl sm:text-2xl text-[#FAD2E1] font-medium"
              >
                {copy.gift.secondGift.subtitle}
              </motion.p>

              {/* Body */}
              <motion.p
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.3 }}
                className="mt-4 text-base sm:text-lg text-[#EADCF5]/90 font-light leading-relaxed max-w-xl mx-auto"
              >
                {copy.gift.secondGift.body}
              </motion.p>
            </div>

            {/* ========================================================
                STEPS TIMELINE (Así empieza este camino)
                Vertical timeline with 4 numbered points, scaleY scroll
                ======================================================== */}
            <div className="relative z-10 mt-14 sm:mt-16 max-w-2xl mx-auto text-left">
              <h3 className="font-editorial-title text-2xl sm:text-3xl text-center text-[#F7E7CE] font-semibold mb-10">
                {copy.gift.secondGift.stepsTitle}
              </h3>

              <div ref={timelineRef} className="relative pl-8 sm:pl-12 space-y-8 sm:space-y-10">
                {/* Vertical Background Line */}
                <div className="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-[2px] bg-[#C7A8DF]/20" />

                {/* Animated Progress Line */}
                <motion.div
                  style={{
                    scaleY: shouldReduceMotion ? 1 : lineScaleY,
                    transformOrigin: "top",
                  }}
                  className="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#C62E4E] via-[#F7E7CE] to-[#C7A8DF]"
                />

                {/* Step Items */}
                {copy.gift.secondGift.steps.map((step) => (
                  <motion.div
                    key={step.number}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, filter: "blur(6px)", y: 14 }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, filter: "blur(0px)", y: 0 }
                    }
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: easeCinematic }}
                    className="relative flex items-start gap-4 sm:gap-6"
                  >
                    {/* Numbered Point */}
                    <div className="absolute -left-[32px] sm:-left-[48px] top-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#C62E4E] to-[#741C3C] border-2 border-[#FAF0F4]/30 text-white font-bold text-sm sm:text-base shadow-lg shadow-black/30">
                      {step.number}
                    </div>

                    <div className="pt-1">
                      <h4 className="font-editorial-title text-xl sm:text-2xl font-semibold text-[#F7E7CE]">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm sm:text-base text-[#EADCF5]/85 font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ========================================================
                AVAILABILITY SECTION (Disponibilidad para citas)
                Days chips, Slots chips, Textarea, Share CTA
                ======================================================== */}
            <div className="relative z-10 mt-14 sm:mt-16 pt-10 border-t border-[#C7A8DF]/20 max-w-2xl mx-auto">
              <h3 className="font-editorial-title text-2xl sm:text-3xl text-[#F7E7CE] font-semibold">
                {copy.gift.secondGift.availabilityTitle}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#EADCF5]/80 font-light">
                {copy.gift.secondGift.availabilityHint}
              </p>

              {/* Days selection chips */}
              <div className="mt-6 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#C7A8DF] mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F7E7CE]" />
                  <span>Días de la semana</span>
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {DAYS_OPTIONS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#C62E4E] text-white shadow-md shadow-[#C62E4E]/30 scale-105"
                            : "bg-[#FAF0F4]/10 hover:bg-[#FAF0F4]/20 text-[#EADCF5] border border-[#C7A8DF]/25"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots selection chips */}
              <div className="mt-6 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#C7A8DF] mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F7E7CE]" />
                  <span>Franja horaria</span>
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SLOTS_OPTIONS.map((slot) => {
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlot(slot)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#C62E4E] text-white shadow-md shadow-[#C62E4E]/30 scale-105"
                            : "bg-[#FAF0F4]/10 hover:bg-[#FAF0F4]/20 text-[#EADCF5] border border-[#C7A8DF]/25"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional notes textarea */}
              <div className="mt-6 text-left">
                <label
                  htmlFor="vale-second-gift-notes"
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7A8DF] mb-2 block"
                >
                  Notas o comentarios (opcional)
                </label>
                <textarea
                  id="vale-second-gift-notes"
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder={copy.gift.secondGift.notesPlaceholder}
                  rows={3}
                  className="w-full rounded-2xl bg-[#FAF0F4]/10 border border-[#C7A8DF]/25 p-3.5 text-sm text-white placeholder-[#EADCF5]/40 focus:outline-none focus:ring-2 focus:ring-[#C7A8DF] resize-none"
                />
              </div>

              {/* Share CTA button (WhatsApp or Clipboard) */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {birthdayConfig.gift.recipientWhatsApp ? (
                  <button
                    onClick={handleWhatsAppShare}
                    disabled={!isShareEnabled}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium shadow-md transition-all duration-300 ${
                      isShareEnabled
                        ? "bg-[#25D366] text-white hover:bg-[#20bd5a] hover:shadow-lg cursor-pointer active:scale-95"
                        : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>{copy.gift.secondGift.shareCta}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCopyShare}
                    disabled={!isShareEnabled}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm sm:text-base font-medium shadow-md transition-all duration-300 ${
                      isShareEnabled
                        ? "bg-[#C62E4E] text-white hover:bg-[#741C3C] hover:shadow-lg cursor-pointer active:scale-95"
                        : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>¡Mensaje copiado con amor!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{copy.gift.secondGift.shareCta}</span>
                      </>
                    )}
                  </button>
                )}

                {/* Always offer clipboard copy as secondary if WhatsApp is configured */}
                {birthdayConfig.gift.recipientWhatsApp && isShareEnabled && (
                  <button
                    onClick={handleCopyShare}
                    className="inline-flex items-center gap-2 text-xs text-[#C7A8DF] hover:text-[#F7E7CE] underline underline-offset-4 py-2 px-3 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>¡Copiado al portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar al portapapeles</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Feedback notice when copied */}
              {copied && (
                <p className="mt-3 text-xs text-[#F7E7CE] animate-fade-in font-medium">
                  {copy.gift.confirmed.copiedNotice}
                </p>
              )}

              {/* Hint when disabled */}
              {!isShareEnabled && (
                <p className="mt-3 text-xs text-[#EADCF5]/60 italic">
                  Selecciona al menos un día y una franja para compartir tu agenda.
                </p>
              )}
            </div>

            {/* ========================================================
                CLOSING (Cormorant cursiva grande)
                ======================================================== */}
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: easeCinematic }}
              className="mt-14 pt-10 border-t border-[#C7A8DF]/20 text-center"
            >
              <p className="font-editorial-quote text-2xl sm:text-3xl lg:text-4xl text-[#F7E7CE] font-normal leading-relaxed max-w-2xl mx-auto">
                "{copy.gift.secondGift.closing}"
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[#C62E4E]">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
