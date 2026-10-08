import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, Film, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { copy } from "../content/copy";
import { easeCinematic } from "../motion/presets";

interface VideoMemoryProps {
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
}

export const VideoMemory: React.FC<VideoMemoryProps> = ({
  onVideoPlay,
  onVideoPause,
}) => {
  const videos = copy.birthdayMessage.videos;
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [id: number]: boolean }>({});
  const videoRefs = useRef<{ [id: number]: HTMLVideoElement | null }>({});
  const cardRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});
  const shouldReduceMotion = useReducedMotion();

  const toggleVideo = (id: number) => {
    const videoEl = videoRefs.current[id];
    if (!videoEl) return;

    if (playingId === id && !videoEl.paused) {
      videoEl.pause();
      setPlayingId(null);
      onVideoPause?.();
    } else {
      // Pause any other active video
      Object.entries(videoRefs.current).forEach(([k, el]) => {
        if (el && Number(k) !== id) {
          el.pause();
        }
      });

      videoEl
        .play()
        .then(() => {
          setPlayingId(id);
          onVideoPlay?.();
        })
        .catch(() => {
          // Playback error or interaction policy
        });
    }
  };

  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRefs.current[id];
    if (!videoEl) return;

    const newMuted = !videoEl.muted;
    videoEl.muted = newMuted;
    setMutedStates((prev) => ({ ...prev, [id]: newMuted }));
  };

  const triggerFullscreen = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const videoEl = videoRefs.current[id];
    if (!videoEl) return;

    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    } else if ((videoEl as any).webkitEnterFullscreen) {
      (videoEl as any).webkitEnterFullscreen(); // iOS Safari native
    }
  };

  // IntersectionObserver to pause video if scrolled significantly out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const cardId = entry.target.getAttribute("data-video-id");
            if (cardId && Number(cardId) === playingId) {
              const videoEl = videoRefs.current[Number(cardId)];
              if (videoEl && !videoEl.paused) {
                videoEl.pause();
                setPlayingId(null);
                onVideoPause?.();
              }
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    Object.values(cardRefs.current).forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [playingId, onVideoPause]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto select-none">
      {videos.map((item, idx) => {
        const isPlaying = playingId === item.id;
        const isMuted = mutedStates[item.id] || false;
        const rotationAngle = idx % 2 === 0 ? -2 : 2;

        return (
          <motion.div
            key={item.id}
            data-video-id={item.id}
            ref={(el) => {
              cardRefs.current[item.id] = el;
            }}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 80, rotate: rotationAngle }
            }
            whileInView={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, rotate: 0 }
            }
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.9,
              delay: idx * 0.12,
              ease: easeCinematic,
            }}
            className="flex flex-col justify-between rounded-3xl bg-white p-4 card-border paper-shadow hover:shadow-xl transition-shadow duration-300"
          >
            {/* Vertical Video Container (9:16 aspect ratio) */}
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#2D1B36] flex items-center justify-center group">
              <video
                ref={(el) => {
                  videoRefs.current[item.id] = el;
                }}
                src={item.webPath}
                playsInline
                preload="metadata"
                onEnded={() => {
                  setPlayingId(null);
                  onVideoPause?.();
                }}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const vEl = e.currentTarget;
                  if (vEl.src !== item.fallbackPath && item.fallbackPath) {
                    vEl.src = item.fallbackPath;
                  }
                }}
              />

              {/* Play Overlay (when paused) */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={() => toggleVideo(item.id)}
                  aria-label={`Reproducir video: ${item.title}`}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[#2D1B36]/50 backdrop-blur-[1px] hover:bg-[#2D1B36]/30 transition-all cursor-pointer p-4 text-center select-none"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#C62E4E] shadow-xl transition-transform duration-300 group-hover:scale-110 active:scale-95">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-white font-medium drop-shadow-sm">
                    <Film className="w-3.5 h-3.5 text-[#C7A8DF]" />
                    <span>Ver recuerdo</span>
                  </div>
                </button>
              )}

              {/* In-video controls when playing */}
              {isPlaying && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
                  <button
                    onClick={() => toggleVideo(item.id)}
                    aria-label="Pausar video"
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                  </button>
                  <button
                    onClick={(e) => toggleMute(item.id, e)}
                    aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => triggerFullscreen(item.id, e)}
                    aria-label="Pantalla completa"
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Title & Description Below Video */}
            <div className="mt-4 px-1 space-y-1.5 text-left">
              <div className="flex items-center justify-between text-[11px] text-[#744A8B] font-semibold tracking-wider uppercase">
                <span>Recuerdo 0{idx + 1} / 04</span>
                <span className="text-[10px] text-[#C62E4E] font-medium tracking-wide">
                  En movimiento
                </span>
              </div>
              <h4 className="font-editorial-title text-base sm:text-lg font-semibold text-[#741C3C] leading-snug">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#382044] font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
