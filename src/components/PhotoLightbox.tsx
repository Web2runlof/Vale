import React, { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { BirthdayPhoto } from "../content/galleryData";
import { easeCinematic } from "../motion/presets";

interface PhotoLightboxProps {
  photo: BirthdayPhoto | null;
  photos: BirthdayPhoto[];
  onClose: () => void;
  onSelectPhoto: (photo: BirthdayPhoto) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const [srcIndex, setSrcIndex] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setSrcIndex(0);
    setHasError(false);
  }, [photo]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else if (currentIndex === 0) {
      onSelectPhoto(photos[photos.length - 1]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else if (currentIndex === photos.length - 1) {
      onSelectPhoto(photos[0]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    if (photo) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose, handlePrev, handleNext]);

  if (!photo) return null;

  const candidateSrcs = [photo.src, ...(photo.fallbackSrcs || [])];
  const activeSrc = candidateSrcs[srcIndex] || photo.src;

  const handleImgError = () => {
    if (srcIndex < candidateSrcs.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Visualizador de fotografía"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: easeCinematic }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1225]/95 backdrop-blur-xl p-4 sm:p-6 select-none"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar vista"
          className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prev button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Fotografía anterior"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Fotografía siguiente"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Draggable Card Container */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120 || info.velocity.y > 500) {
              onClose(); // Vertical drag closes
            } else if (info.offset.x < -80 || info.velocity.x < -300) {
              handleNext(); // Swipe left -> next
            } else if (info.offset.x > 80 || info.velocity.x > 300) {
              handlePrev(); // Swipe right -> prev
            }
          }}
          className="relative max-h-[85vh] max-w-4xl w-full flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#2D1B36] border border-white/10 shadow-2xl max-h-[72vh] flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.35, ease: easeCinematic }}
                className="flex items-center justify-center w-full h-full"
              >
                {!hasError ? (
                  <img
                    src={activeSrc}
                    alt={photo.alt}
                    referrerPolicy="no-referrer"
                    decoding="async"
                    className="max-h-[70vh] w-auto max-w-full object-contain pointer-events-none select-none"
                    onError={handleImgError}
                  />
                ) : (
                  /* Editorial fallback */
                  <div className="p-8 sm:p-14 text-center text-[#EADCF5] max-w-md select-none">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#C7A8DF]">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="font-editorial-quote text-xl sm:text-2xl text-white mb-2">
                      "{photo.caption || photo.alt}"
                    </p>
                    <p className="text-xs tracking-widest uppercase text-[#C7A8DF]">
                      Recuerdo de cumpleaños
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Caption bar */}
          <div className="mt-4 px-4 text-center pointer-events-none">
            <p className="text-white/90 font-serif italic text-base sm:text-lg">
              {photo.caption || photo.alt}
            </p>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#C7A8DF]/80">
              <span>{currentIndex + 1} de {photos.length}</span>
              <span>·</span>
              <span>Desliza para explorar</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
