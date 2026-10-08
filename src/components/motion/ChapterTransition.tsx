import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { PawPrint, Sparkles } from "lucide-react";
import { easeCinematic } from "../../motion/presets";
import { ParticleField } from "./ParticleField";

interface ChapterTransitionProps {
  eyebrow: string;
  title: string;
  theme?: "dark" | "light";
  quote?: string;
  className?: string;
  withParticles?: boolean;
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  eyebrow,
  title,
  theme = "light",
  quote,
  className = "",
  withParticles = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isDark = theme === "dark" || withParticles;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.45, 0.55, 0.9],
    [0.7, 1, 1, 0.7]
  );

  const pawsY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={containerRef}
      className={`relative ${
        withParticles
          ? "min-h-[90svh] bg-gradient-to-b from-[#1E1028] to-[#382044] text-white flex flex-col justify-end pb-12 sm:pb-20 pt-16"
          : isDark
          ? "min-h-[50svh] sm:min-h-[60svh] py-20 bg-[#382044] text-white flex flex-col items-center justify-center"
          : "min-h-[50svh] sm:min-h-[60svh] py-20 bg-[#FDF8FC] text-[#382044] flex flex-col items-center justify-center"
      } items-center overflow-hidden px-6 text-center select-none ${className}`}
    >
      {/* Background particle system or radial glow */}
      {withParticles ? (
        <ParticleField />
      ) : (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            isDark
              ? "bg-[radial-gradient(circle_at_center,rgba(116,74,139,0.25)_0%,transparent_70%)]"
              : "bg-[radial-gradient(circle_at_center,rgba(234,220,245,0.45)_0%,transparent_70%)]"
          }`}
        />
      )}

      {/* Dog Paw Prints Background Watermark (only when particles not active) */}
      {!withParticles && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          style={{
            y: shouldReduceMotion ? 0 : pawsY,
          }}
        >
          <div className="relative flex items-center justify-center gap-4 sm:gap-10">
            <PawPrint
              className={`w-20 h-20 sm:w-28 sm:h-28 -rotate-25 -translate-y-6 opacity-[0.09] hidden xs:block ${
                isDark ? "text-white fill-white/60" : "text-[#744A8B] fill-[#744A8B]/60"
              }`}
            />
            <PawPrint
              className={`w-36 h-36 sm:w-56 sm:h-56 -rotate-12 opacity-[0.15] ${
                isDark ? "text-white fill-white/80" : "text-[#744A8B] fill-[#744A8B]/70"
              }`}
            />
            <PawPrint
              className={`w-32 h-32 sm:w-48 sm:h-48 rotate-15 translate-y-6 opacity-[0.14] ${
                isDark ? "text-white fill-white/80" : "text-[#C7A8DF] fill-[#C7A8DF]/70"
              }`}
            />
            <PawPrint
              className={`w-20 h-20 sm:w-28 sm:h-28 rotate-25 translate-y-12 opacity-[0.09] hidden xs:block ${
                isDark ? "text-white fill-white/60" : "text-[#C7A8DF] fill-[#C7A8DF]/60"
              }`}
            />
          </div>
        </motion.div>
      )}

      {/* Foreground Content */}
      <motion.div
        style={{ opacity: shouldReduceMotion ? 1 : opacity }}
        className={`relative z-10 max-w-xl mx-auto space-y-4 pointer-events-none ${
          withParticles
            ? "w-full px-6 py-6 rounded-2xl bg-gradient-to-t from-[#1E1028]/95 via-[#1E1028]/85 to-transparent backdrop-blur-[2px]"
            : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: easeCinematic }}
          className={`inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] ${
            withParticles
              ? "text-[#FFE29A] drop-shadow-sm"
              : isDark
              ? "text-[#C7A8DF]"
              : "text-[#744A8B]"
          }`}
        >
          {withParticles ? (
            <Sparkles className="w-3.5 h-3.5 text-[#FFE29A]" />
          ) : (
            <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
          )}
          <span>{eyebrow}</span>
          {withParticles ? (
            <Sparkles className="w-3.5 h-3.5 text-[#FFE29A]" />
          ) : (
            <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1, ease: easeCinematic }}
          className={`font-editorial-title text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight ${
            withParticles ? "text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" : ""
          }`}
        >
          {title}
        </motion.h2>

        {quote && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.2, ease: easeCinematic }}
            className={`font-serif italic text-lg sm:text-xl font-light pt-2 max-w-md mx-auto ${
              withParticles
                ? "text-[#F7E7CE] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                : isDark
                ? "text-[#EADCF5]/80"
                : "text-[#741C3C]/80"
            }`}
          >
            "{quote}"
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};
