import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Heart, RotateCcw, Sparkles, PawPrint } from "lucide-react";
import { copy } from "../content/copy";
import { galleryPhotos, BirthdayPhoto } from "../content/galleryData";
import { FullBleedScene } from "./motion/FullBleedScene";
import { easeCinematic } from "../motion/presets";

interface LoveLetterProps {
  onPhotoClick?: (photo: BirthdayPhoto) => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ onPhotoClick }) => {
  const letterRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Foto 26 before the letter
  const photo26 = galleryPhotos.find((p) => p.id === 26) || galleryPhotos[0];

  const scrollToLetterTop = () => {
    if (letterRef.current) {
      letterRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const paragraphVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
      }
    : {
        hidden: { opacity: 0, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: easeCinematic },
        },
      };

  return (
    <>
      {/* Full-Bleed Prologue Scene before the letter (Foto 26) */}
      <FullBleedScene
        photo={photo26}
        heightVh={160}
        align="center"
        onClickPhoto={onPhotoClick}
      >
        <div className="max-w-xl mx-auto text-center space-y-4 px-6">
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#C7A8DF]">
            Un momento para el corazón
          </span>
          <p className="font-editorial-quote text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-snug drop-shadow-md">
            "{photo26.caption || 'Tu felicidad es mi lugar favorito'}"
          </p>
        </div>
      </FullBleedScene>

      {/* Chapter 5: Love Letter */}
      <section
        id="carta"
        ref={letterRef}
        className="relative pt-10 pb-24 sm:pt-14 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF4FB] via-[#F8F0FA] to-[#FAF4FB] select-none"
      >
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: easeCinematic }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.25em] uppercase text-[#744A8B]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C62E4E]" />
              <span>{copy.loveLetter.tag}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.1, ease: easeCinematic }}
              className="font-editorial-title text-4xl sm:text-5xl lg:text-6xl text-[#382044] font-normal tracking-tight"
            >
              {copy.loveLetter.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.2, ease: easeCinematic }}
              className="text-base text-[#744A8B]/80 font-sans font-light"
            >
              {copy.loveLetter.subtitle}
            </motion.p>
          </div>

          {/* 3D Perspective Paper Parchment Container */}
          <div style={{ perspective: 1200 }}>
            <motion.article
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { rotateX: 8, y: 60, opacity: 0 }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.2, ease: easeCinematic }}
              style={{
                background: "radial-gradient(circle at 50% 15%, #FFFDFE 0%, #FAF5FC 100%)",
                transformStyle: "preserve-3d",
              }}
              className="relative rounded-3xl p-8 sm:p-14 lg:p-16 paper-shadow card-border text-[#392C40]"
            >
              {/* Corner Watermark Dog Paw */}
              <div className="absolute top-6 right-6 text-[#744A8B]/10 rotate-15 pointer-events-none select-none">
                <PawPrint className="w-16 h-16 fill-[#744A8B]/10" />
              </div>

              {/* Subtle top stamp detail */}
              <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#EADCF5]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#744A8B] font-medium">
                  <Heart className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
                  <span>Para Vale</span>
                </div>
                <span className="text-xs text-[#744A8B]/70 font-serif italic">
                  Con amor infinito en tu cumpleaños
                </span>
              </div>

              {/* Salutation */}
              <h3 className="font-editorial-title text-2xl sm:text-3xl text-[#741C3C] font-medium tracking-tight mb-8">
                Vale... Amorcito mío de mi corazón ❤️
              </h3>

              {/* Body Paragraphs - Verbatim without alterations */}
              <div className="space-y-7 text-base sm:text-lg leading-[1.85] font-light text-[#392C40]">
                <motion.p
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-pretty"
                >
                  Hoy celebro con inmensa felicidad el regalo maravilloso que es tu vida.
                  Deseo de todo corazón que este cumpleaños esté lleno de amor, alegría
                  y momentos inolvidables. Que la vida te regale salud, paz, éxitos,
                  prosperidad, abundancia, sueños cumplidos y, sobre todo, muchísimas
                  razones para ser feliz. Porque mereces todo lo bonito que este mundo
                  tiene para ofrecer.
                </motion.p>

                <motion.p
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-pretty"
                >
                  Este año nos regalamos un viaje espectacular y, aunque conocimos
                  lugares increíbles, lo más bonito para mí fue disfrutar cada
                  instante a tu lado. Sueño con que sigamos recorriendo el mundo juntos,
                  coleccionando aventuras, atardeceres, risas, besos y recuerdos que
                  nos acompañen toda la vida.
                </motion.p>

                <motion.div
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="pl-4 sm:pl-6 border-l-2 border-[#C7A8DF] my-8 py-1"
                >
                  <p className="text-pretty text-[#382044]">
                    Este cumpleaños lo siento diferente.{" "}
                    <strong className="font-serif italic font-semibold text-[#741C3C] text-lg sm:text-xl">
                      Nos siento diferentes. Más maduros, más amorosos, más conscientes del
                      amor que estamos construyendo.
                    </strong>{" "}
                    Me emociona ver cómo hemos crecido y pensar en todo lo hermoso que
                    todavía nos espera.
                  </p>
                </motion.div>

                <motion.p
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-pretty"
                >
                  Quiero seguir celebrando tu vida, acompañarte en tus sueños,
                  abrazarte en los días difíciles y disfrutar contigo cada una de las
                  alegrías que están por venir. Quiero seguir enamorándome de ti, de
                  tus sonrisas, de tus locuras y de cada nueva versión de la mujer
                  maravillosa que eres.
                </motion.p>

                {/* Birthday Wish Callout */}
                <motion.div
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#FAF0F4] via-[#FBF5FA] to-[#FAF0F4] border border-[#C62E4E]/20 text-center"
                >
                  <Heart className="w-5 h-5 mx-auto text-[#C62E4E] fill-[#C62E4E] mb-3" />
                  <p className="font-editorial-quote text-xl sm:text-2xl text-[#741C3C] leading-snug">
                    "Y si hoy pudiera pedir un deseo, aunque el cumpleaños sea tuyo,
                    pediría que la vida me siga regalando el privilegio de celebrar la
                    tuya. Una y otra vez, por muchos, muchísimos años más."
                  </p>
                </motion.div>

                <motion.p
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-pretty"
                >
                  Feliz cumpleaños, mi amor. Gracias por ser tú, por lo que somos y por
                  todo lo que todavía nos falta vivir.
                </motion.p>

                {/* Valediction */}
                <motion.p
                  variants={paragraphVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="pt-4 font-editorial-title text-xl sm:text-2xl text-[#741C3C] font-semibold"
                >
                  Te amo, Vale. Hoy, mañana y en todos los cumpleaños que nos esperan. ❤️
                </motion.p>
              </div>

              {/* Bottom signature and progressive heart */}
              <div className="mt-14 pt-8 border-t border-[#EADCF5] flex flex-col items-center text-center">
                <div className="relative mb-2 flex items-center justify-center gap-3">
                  <PawPrint className="w-5 h-5 text-[#744A8B]/50 fill-[#C7A8DF]/50 -rotate-15" />
                  <Heart className="w-8 h-8 text-[#C62E4E] fill-[#C62E4E] animate-pulse" />
                  <PawPrint className="w-5 h-5 text-[#744A8B]/50 fill-[#C7A8DF]/50 rotate-15" />
                </div>

                {/* Animated SVG Signature flourish stroke */}
                <svg
                  viewBox="0 0 240 32"
                  className="w-48 h-7 text-[#C62E4E] stroke-current mb-2 overflow-visible"
                >
                  <motion.path
                    d="M 10 20 Q 60 5 120 18 T 230 14"
                    fill="transparent"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>

                <p className="font-editorial-quote text-2xl text-[#382044]">
                  {copy.loveLetter.signature}
                </p>

                {/* Re-read button */}
                <button
                  onClick={scrollToLetterTop}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-[#744A8B] hover:text-[#741C3C] transition-colors py-2 px-4 rounded-full hover:bg-[#EADCF5]/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#744A8B]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{copy.loveLetter.reReadButton}</span>
                </button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </>
  );
};
