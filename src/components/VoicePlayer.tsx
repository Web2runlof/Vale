import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, Volume2, Heart, Sparkles } from "lucide-react";
import { copy } from "../content/copy";
import { birthdayConfig } from "../content/birthdayConfig";

interface VoicePlayerProps {
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  onAudioStart,
  onAudioEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const audioSrc = birthdayConfig.assets.voiceMessage;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        setIsAudioAvailable(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onAudioEnd?.();
    };

    const handleError = () => {
      setIsAudioAvailable(false);
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [onAudioEnd]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || isAudioAvailable === false) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onAudioEnd?.();
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          onAudioStart?.();
        })
        .catch(() => {
          setIsAudioAvailable(false);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current && isAudioAvailable) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const waveBars = [
    25, 45, 75, 35, 90, 65, 40, 85, 95, 55, 35, 70, 80, 50, 65, 90, 40, 75, 60,
    30, 85, 45, 60, 30,
  ];

  return (
    <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#FAF3FC] via-[#F4E9F8] to-[#EEDEF6] card-border paper-shadow max-w-xl mx-auto overflow-hidden select-none">
      {/* Real Audio Element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Decorative Heart Accent */}
      <div className="absolute top-4 right-4 text-[#C62E4E]/40 pointer-events-none">
        <Heart className="w-5 h-5 fill-current" />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="p-2.5 rounded-full bg-white text-[#744A8B] shadow-xs">
          <Volume2 className="w-4 h-4 text-[#C62E4E]" />
        </span>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#744A8B]">
            {copy.birthdayMessage.voiceTag}
          </span>
          <p className="text-sm font-serif italic text-[#382044]">
            {copy.birthdayMessage.prePlayerText}
          </p>
        </div>
      </div>

      {isAudioAvailable === false ? (
        /* Pending state */
        <div className="my-6 p-5 rounded-2xl bg-white/70 border border-[#C7A8DF]/40 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#744A8B] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C62E4E]" />
            <span>Espacio reservado para tu mensaje de voz</span>
          </div>
          <p className="text-xs text-[#382044]/80 font-sans leading-relaxed">
            Sube tu archivo de audio personal a{" "}
            <code className="bg-[#EADCF5]/70 px-1.5 py-0.5 rounded text-[11px] font-mono text-[#382044]">
              /media/audio/voice-message.mp3
            </code>{" "}
            para escucharlo en este reproductor.
          </p>
        </div>
      ) : (
        /* Interactive Player */
        <>
          {/* Animated Wave Display with Motion */}
          <div className="my-6 flex items-center justify-center gap-1 sm:gap-1.5 h-16 px-4 bg-white/80 rounded-2xl border border-[#C7A8DF]/30">
            {waveBars.map((h, i) => {
              const progress = duration > 0 ? (currentTime / duration) * waveBars.length : 0;
              const isPassed = i <= progress;

              return (
                <motion.span
                  key={i}
                  animate={
                    isPlaying && !shouldReduceMotion
                      ? {
                          scaleY: [0.4, 1.1, 0.3, 0.9, 0.4],
                        }
                      : { scaleY: 1 }
                  }
                  transition={{
                    duration: 0.8 + (i % 5) * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (i % 6) * 0.08,
                  }}
                  className={`w-1 sm:w-1.5 origin-bottom rounded-full transition-colors duration-200 ${
                    isPassed ? "bg-[#C62E4E]" : "bg-[#C7A8DF]/50"
                  }`}
                  style={{
                    height: `${h * 0.55}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Progress slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!isAudioAvailable}
              aria-label="Progreso del mensaje de voz"
              className="w-full accent-[#C62E4E] cursor-pointer h-1.5 bg-[#C7A8DF]/40 rounded-lg"
            />
            <div className="flex justify-between text-xs text-[#744A8B] font-mono tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Play/Pause Control Button */}
          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={togglePlay}
              disabled={!isAudioAvailable}
              aria-label={isPlaying ? "Pausar audio" : "Reproducir mensaje de voz"}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C62E4E] text-white hover:bg-[#d8355a] transition-all duration-300 shadow-md active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C7A8DF]"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
