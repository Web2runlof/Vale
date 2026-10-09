import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { galleryPhotos, type BirthdayPhoto } from "../content/galleryData";
import { ImageWithFallback } from "./ImageWithFallback";

interface BirthdayPhotoEncoreProps {
  onPhotoClick: (photo: BirthdayPhoto) => void;
}

/**
 * Keeps every photo in the 28-image collection visible somewhere in the
 * birthday journey, without modifying the letter or final surprise.
 * These four photos were indexed but never actually mounted on the page.
 */
const encorePhotoIds = [7, 10, 15, 16];

export const BirthdayPhotoEncore: React.FC<BirthdayPhotoEncoreProps> = ({
  onPhotoClick,
}) => {
  const reduceMotion = useReducedMotion();
  const photos = encorePhotoIds
    .map((id) => galleryPhotos.find((item) => item.id === id))
    .filter((photo): photo is BirthdayPhoto => Boolean(photo));

  return (
    <section
      id="momentos-extra"
      aria-label="Más momentos para celebrar a Vale"
      className="relative overflow-hidden bg-[#FDF8FC] px-4 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#744A8B]">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-[#C62E4E]" />
            Un poquito más de felicidad
          </span>
          <h2 className="font-editorial-title text-4xl font-normal leading-tight text-[#382044] sm:text-5xl">
            Porque celebrarte nunca es suficiente.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#744A8B] sm:text-base">
            Cuatro instantes más para celebrar tu sonrisa, tus aventuras y todo lo bonito que eres.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.08 }}
              className="min-w-0"
            >
              <ImageWithFallback
                photo={photo}
                aspectRatioClass="aspect-[3/4]"
                className="w-full shadow-lg"
                onClick={() => onPhotoClick(photo)}
              />
              <p className="mt-3 px-1 text-center text-xs leading-snug text-[#744A8B] sm:text-sm">
                {photo.caption || "Un momento especial"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
