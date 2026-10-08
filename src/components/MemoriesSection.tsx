import React from "react";
import { motion } from "motion/react";
import { Sparkles, Heart, ArrowDown, PawPrint } from "lucide-react";
import { copy } from "../content/copy";
import { VoicePlayer } from "./VoicePlayer";
import { VideoMemory } from "./VideoMemory";
import { RevealText } from "./motion/RevealText";
import { easeCinematic } from "../motion/presets";

interface MemoriesSectionProps {
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  onProceedToGift: () => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({
  onAudioStart,
  onAudioEnd,
  onVideoPlay,
  onVideoPause,
  onProceedToGift,
}) => {
  return (
    <section id="mensaje" className="relative pt-8 pb-24 sm:pt-10 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20 sm:space-y-24 select-none">
      {/* 1. Header: Birthday Audio Note */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: easeCinematic }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#744A8B]">
          <PawPrint className="w-3.5 h-3.5 text-[#C62E4E]" />
          <span>{copy.birthdayMessage.tag}</span>
        </div>

        <RevealText
          text={copy.birthdayMessage.title}
          as="h2"
          by="words"
          className="font-editorial-title text-3xl sm:text-4xl lg:text-5xl font-medium text-[#382044] tracking-tight leading-[1.15] text-balance"
        />

        <p className="text-base sm:text-lg text-[#744A8B] font-light leading-relaxed">
          {copy.birthdayMessage.subtitle}
        </p>
      </motion.div>

      {/* Voice Note Player */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, delay: 0.1, ease: easeCinematic }}
        className="max-w-xl mx-auto"
      >
        <VoicePlayer onAudioStart={onAudioStart} onAudioEnd={onAudioEnd} />
      </motion.div>

      {/* 2. Independent Videos Section: "La felicidad también se ve así. ✨" */}
      <div className="space-y-12 pt-8 border-t border-[#EADCF5]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: easeCinematic }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C62E4E]">
            <PawPrint className="w-3.5 h-3.5 fill-[#C62E4E]" />
            <span>Pedacitos de felicidad</span>
          </div>

          <RevealText
            text={copy.birthdayMessage.videosHeader.title}
            as="h3"
            by="words"
            className="font-editorial-title text-3xl sm:text-4xl text-[#382044] font-medium tracking-tight"
          />

          <p className="text-base text-[#744A8B] font-light leading-relaxed">
            {copy.birthdayMessage.videosHeader.subtitle}
          </p>
        </motion.div>

        {/* 4 Vertical Video Cards with Scroll Reveal */}
        <VideoMemory onVideoPlay={onVideoPlay} onVideoPause={onVideoPause} />
      </div>

      {/* 3. Transition to the Final Birthday Surprise with Progressive Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: easeCinematic }}
        className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#382044] via-[#2A1734] to-[#382044] text-white text-center shadow-xl border border-[#744A8B]/30 max-w-3xl mx-auto overflow-hidden"
      >
        <div className="flex justify-center mb-4 text-[#C7A8DF]/60">
          <Sparkles className="w-5 h-5 text-[#C62E4E] animate-sparkle" />
        </div>

        <p className="text-base sm:text-lg font-light text-[#EADCF5]/85 mb-2">
          ¿Pensaste que todo terminaba aquí?
        </p>

        <RevealText
          text="Todavía nos queda lo más especial. ✨"
          as="h3"
          by="words"
          className="font-editorial-title text-3xl sm:text-4xl lg:text-5xl text-white font-medium mb-8"
        />

        <button
          onClick={onProceedToGift}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#C62E4E] hover:bg-[#d9385b] text-white text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C7A8DF]"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Descubrir la sorpresa 🎁</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
};
