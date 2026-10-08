import React, { useState, useRef, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { birthdayConfig } from "../content/birthdayConfig";

interface MusicControllerProps {
  isSuppressed: boolean; // true when voice or video is playing
}

export const MusicController: React.FC<MusicControllerProps> = ({ isSuppressed }) => {
  const musicSrc = birthdayConfig.assets.music;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wasPlayingBeforeSuppression, setWasPlayingBeforeSuppression] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // If no music configured in assets, hide completely
  if (!musicSrc) return null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isSuppressed) {
      if (isPlaying) {
        setWasPlayingBeforeSuppression(true);
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      if (wasPlayingBeforeSuppression) {
        audio.play().then(() => {
          setIsPlaying(true);
          setWasPlayingBeforeSuppression(false);
        }).catch(() => {
          setWasPlayingBeforeSuppression(false);
        });
      }
    }
  }, [isSuppressed, isPlaying, wasPlayingBeforeSuppression]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setWasPlayingBeforeSuppression(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Audio playback rejected or file missing
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio ref={audioRef} src={musicSrc} loop preload="none" />

      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Silenciar música ambiental" : "Reproducir música ambiental"}
        className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#744A8B] ${
          isPlaying
            ? "bg-[#741C3C] text-white ring-2 ring-white/20"
            : "bg-white/90 text-[#382044] hover:bg-white border border-[#C7A8DF]/50"
        }`}
      >
        {isPlaying ? (
          <>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <Music className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wide pr-1">Música activa</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-[#744A8B]" />
            <span className="text-xs font-medium text-[#744A8B] tracking-wide pr-1 hidden sm:inline">
              Música
            </span>
          </>
        )}
      </button>
    </div>
  );
};
