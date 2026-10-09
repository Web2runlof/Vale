import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Clock, Heart, Sparkles, PawPrint, Calendar } from "lucide-react";
import { galleryPhotos, BirthdayPhoto } from "../content/galleryData";
import { ImageWithFallback } from "./ImageWithFallback";
import { easeCinematic } from "../motion/presets";

interface BirthdayCountdown2027Props {
  onPhotoClick?: (photo: BirthdayPhoto) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReached: boolean;
}

export const BirthdayCountdown2027: React.FC<BirthdayCountdown2027Props> = ({
  onPhotoClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Target date: October 12, 2027
  const targetDate = new Date("2027-10-12T00:00:00");

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isReached: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isReached: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Default background photo (Foto 25 or fallback)
  const defaultBgPhoto =
    galleryPhotos.find((p) => p.id === 25) ||
    galleryPhotos.find((p) => p.id === 2) ||
    galleryPhotos[0];

  const activePhoto: BirthdayPhoto = defaultBgPhoto;

  return (
    <section
      id="contador-2027"
      className="relative w-full min-h-[80svh] py-14 sm:py-20 px-4 flex flex-col items-center justify-center overflow-hidden select-none bg-[#1A0D22] text-white"
    >
      {/* Background Photo Layer */}
      <div className="absolute inset-0 w-full h-full">
        <div
          onClick={() => activePhoto && onPhotoClick?.(activePhoto)}
          className={`w-full h-full ${onPhotoClick ? "cursor-pointer" : ""}`}
        >
          <ImageWithFallback
            photo={activePhoto}
            aspectRatioClass="h-full w-full"
            className="h-full w-full rounded-none border-none object-cover scale-105 filter brightness-[0.65] contrast-[1.05]"
          />
        </div>
      </div>

      {/* Cinematic Dark Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C0E24]/80 via-[#281335]/75 to-[#1C0E24]/90 pointer-events-none" />

      {/* Subtle Glowing Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,46,78,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* Foreground Content Card */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center space-y-10">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeCinematic }}
          className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#C7A8DF] py-2 px-5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md shadow-lg"
        >
          <PawPrint className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
          <Calendar className="w-3.5 h-3.5 text-[#C7A8DF]" />
          <span>12 DE OCTUBRE DE 2027</span>
          <PawPrint className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
        </motion.div>

        {/* Main Headings */}
        <div className="space-y-4 max-w-2xl mx-auto px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.1, ease: easeCinematic }}
            className="font-editorial-title text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-white drop-shadow-md text-balance"
          >
            Ahora la cuenta regresiva para tu siguiente cumple.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easeCinematic }}
            className="font-editorial-quote text-xl sm:text-2xl text-[#EADCF5] italic font-light drop-shadow-sm max-w-xl mx-auto"
          >
            Sin duda el 2027 será muy muy especial. ✨
          </motion.p>
        </div>

        {/* Countdown Timer Grid with Staggered Progressive Entrance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto px-2">
          {[
            { label: "Días", value: timeLeft.days },
            { label: "Horas", value: timeLeft.hours },
            { label: "Minutos", value: timeLeft.minutes },
            { label: "Segundos", value: timeLeft.seconds },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.85,
                delay: 0.2 + idx * 0.1,
                ease: easeCinematic,
              }}
              className="relative group rounded-2xl sm:rounded-3xl bg-black/45 hover:bg-black/55 backdrop-blur-md p-5 sm:p-7 border border-white/15 shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {/* Subtle card glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

              <span className="font-editorial-title text-4xl sm:text-6xl font-semibold text-[#FAF0F4] tracking-tight drop-shadow-lg tabular-nums">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#C7A8DF]/90">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Message Footer and Background Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.4, ease: easeCinematic }}
          className="pt-4 flex flex-col items-center gap-5"
        >
          <div className="flex items-center gap-2 text-xs text-[#EADCF5]/80 font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C62E4E]" />
            <span>Faltan exactamente estos momentos para celebrar tu día</span>
            <Heart className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
          </div>

        </motion.div>
      </div>
    </section>
  );
};
