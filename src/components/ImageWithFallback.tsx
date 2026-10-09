import React, { useEffect, useRef, useState } from "react";
import { Camera, Eye, Sparkles } from "lucide-react";
import { BirthdayPhoto } from "../content/galleryData";

interface ImageWithFallbackProps {
  photo: BirthdayPhoto;
  className?: string;
  onClick?: () => void;
  aspectRatioClass?: string;
  priority?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  photo,
  className = "",
  onClick,
  aspectRatioClass = "aspect-[4/5]",
  priority = false,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentSrcIndex, setCurrentSrcIndex] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentSrcIndex(0);
    setHasError(false);
    // Cached files can finish loading before the effect runs (especially Safari).
    setIsLoading(!(imageRef.current?.complete && imageRef.current.naturalWidth > 0));
  }, [photo.src]);

  // Candidate sources list: primary src first, then fallbacks
  const candidateSrcs = [photo.src, ...(photo.fallbackSrcs || [])];
  const activeSrc = candidateSrcs[currentSrcIndex] || photo.src;

  const handleImageError = () => {
    if (currentSrcIndex < candidateSrcs.length - 1) {
      // Try next candidate
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      // All candidate paths exhausted, display refined editorial placeholder
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-[#F6EEFA] transition-all duration-300 card-border ${aspectRatioClass} ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      } ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-tr from-[#EADCF5]/60 via-[#FDF8FC] to-[#EADCF5]/40" />
      )}

      {/* Actual Image with smooth blur-up reveal */}
      {!hasError ? (
        <img
          ref={imageRef}
          src={activeSrc}
          alt={photo.alt}
          referrerPolicy="no-referrer"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoading(false)}
          onError={handleImageError}
          className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoading ? "filter blur-lg scale-105 opacity-0" : "filter blur-0 scale-100 opacity-100"
          } ${
            photo.focalPoint ? `object-${photo.focalPoint}` : "object-center"
          }`}
        />
      ) : (
        /* High-End Editorial Birthday Placeholder */
        <div className="absolute inset-0 flex flex-col justify-between p-5 text-center bg-gradient-to-b from-[#FAF4FD] via-[#F4EAF9] to-[#EADCF5]/75 select-none">
          {/* Header metadata */}
          <div className="flex items-center justify-between text-[11px] font-medium tracking-widest uppercase text-[#744A8B]/70">
            <span>{photo.category ? `Recuerdo · ${photo.category}` : "Recuerdo"}</span>
            <span className="inline-flex items-center gap-1 text-[#C62E4E]">
              <Sparkles className="w-3 h-3" />
              <span>Vale</span>
            </span>
          </div>

          <div className="my-auto px-2">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-xs border border-[#C7A8DF]/40 text-[#744A8B]">
              <Camera className="w-5 h-5 text-[#744A8B]/80" />
            </div>
            <p className="font-editorial-quote text-base sm:text-lg text-[#382044] leading-snug line-clamp-2">
              "{photo.caption || photo.alt}"
            </p>
          </div>

          <div className="text-[10px] text-[#744A8B]/60 font-sans tracking-wide truncate">
            {photo.caption ? photo.caption : `Fotografía especial · Toca para ampliar`}
          </div>
        </div>
      )}

      {/* Hover Lightbox Indicator Overlay */}
      {onClick && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#382044]/25 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-medium text-[#382044] shadow-md">
            <Eye className="w-3.5 h-3.5 text-[#C62E4E]" />
            <span>Ver foto</span>
          </div>
        </div>
      )}

      {/* Discreet Caption Tag if loaded */}
      {photo.caption && !hasError && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#382044]/80 via-[#382044]/30 to-transparent p-3 pt-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-xs font-sans tracking-wide leading-tight drop-shadow-xs">
            {photo.caption}
          </p>
        </div>
      )}
    </div>
  );
};
