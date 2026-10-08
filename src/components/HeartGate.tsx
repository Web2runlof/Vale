import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { PawPrint, Sparkles } from "lucide-react";
import { copy } from "../content/copy";
import { easeInOutExpo, spring } from "../motion/presets";

interface HeartGateProps {
  onUnlock: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const HeartGate: React.FC<HeartGateProps> = ({ onUnlock }) => {
  const [taps, setTaps] = useState<number>(0);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [heartBeatScale, setHeartBeatScale] = useState<number>(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const touchHandledRef = useRef<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Fill percentage: 0%, 20%, 40%, 60%, 80%, 100%
  const fillPercentage = Math.min(100, taps * 20);
  const currentTapInfo = copy.heartGate.taps.find((t) => t.count === taps);

  const triggerHeartbeat = (tapCount: number) => {
    // Generate gentle burst particles around the heart
    const newParticles: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 100 - 30,
      size: Math.random() * 6 + 4,
      color: Math.random() > 0.4 ? "#C62E4E" : "#741C3C",
    }));
    setParticles(newParticles);

    if (tapCount < 5) {
      setHeartBeatScale(1 + tapCount * 0.05);
      setTimeout(() => setHeartBeatScale(1), 320);
    }
  };

  const handleHeartInteraction = () => {
    if (taps >= 5 || isUnlocking) return;

    const nextTaps = taps + 1;
    setTaps(nextTaps);
    triggerHeartbeat(nextTaps);

    if (nextTaps === 5) {
      // 5th tap: Final heartbeat (scale 1 -> 1.15 -> 0.95)
      setHeartBeatScale(1.15);
      setTimeout(() => {
        setHeartBeatScale(0.95);
      }, 200);

      setTimeout(() => {
        setIsUnlocking(true);
        try {
          // Exactly 35 confetti particles as specified
          confetti({
            particleCount: 35,
            spread: 70,
            origin: { y: 0.5 },
            colors: ["#C62E4E", "#744A8B", "#C7A8DF", "#F7E7CE"],
          });
        } catch {
          // Canvas confetti fallback
        }

        // Unlock after 1.4s smooth mask transition
        setTimeout(() => {
          onUnlock();
        }, 1400);
      }, 450);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && taps < 5 && !isUnlocking) {
        e.preventDefault();
        handleHeartInteraction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [taps, isUnlocking]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        isUnlocking
          ? {
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 1.12,
              filter: shouldReduceMotion ? "none" : "blur(6px)",
              transition: {
                duration: 1.4,
                ease: easeInOutExpo,
              },
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      exit={{
        opacity: 0,
        scale: 1.1,
        transition: { duration: 0.8, ease: easeInOutExpo },
      }}
      className="fixed inset-0 z-50 flex h-[100svh] min-h-[100svh] flex-col items-center justify-between overflow-hidden bg-[#FAF4FB] px-6 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] select-none"
    >
      {/* Background radial lavender aura */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(199, 168, 223, ${
            0.15 + taps * 0.1
          }) 0%, rgba(250, 244, 251, 0) 70%)`,
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 text-center max-w-md mx-auto pt-2 sm:pt-6 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.28em] text-[#744A8B] uppercase">
          <PawPrint className="w-3 h-3 text-[#C62E4E]" />
          <span>Para Vale</span>
          <PawPrint className="w-3 h-3 text-[#C62E4E]" />
        </span>
        <h1 className="mt-2.5 font-editorial-title text-2xl sm:text-3xl lg:text-4xl text-[#382044] tracking-tight leading-snug">
          {copy.heartGate.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#744A8B]/80 font-sans font-light">
          {copy.heartGate.subtitle}
        </p>
      </header>

      {/* Center Interactive Heart */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative">
          {/* Subtle floating paw prints */}
          <div className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 text-[#744A8B]/30 rotate-[-20deg] pointer-events-none">
            <PawPrint className="w-8 h-8 fill-[#C7A8DF]/40" />
          </div>
          <div className="absolute -right-12 sm:-right-16 top-1/3 text-[#744A8B]/30 rotate-[20deg] pointer-events-none">
            <PawPrint className="w-7 h-7 fill-[#C7A8DF]/40" />
          </div>

          {/* Lavender halo behind heart when tapping */}
          <div
            className={`absolute -inset-10 rounded-full bg-[#EADCF5] blur-2xl transition-all duration-700 pointer-events-none ${
              taps === 5 ? "opacity-90 scale-150" : taps > 0 ? "opacity-50 scale-110" : "opacity-20 scale-90"
            }`}
          />

          {/* Particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute left-1/2 top-1/2 rounded-full pointer-events-none transition-all duration-700 ease-out animate-ping"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                transform: `translate(${p.x}px, ${p.y}px)`,
                opacity: 0.85,
              }}
            />
          ))}

          {/* Motion Heart Container */}
          <motion.div
            animate={{ scale: heartBeatScale }}
            transition={spring}
          >
            <button
              type="button"
              onClick={(e) => {
                if (touchHandledRef.current) return;
                handleHeartInteraction();
              }}
              onTouchStart={() => {
                touchHandledRef.current = true;
                handleHeartInteraction();
                setTimeout(() => {
                  touchHandledRef.current = false;
                }, 350);
              }}
              aria-label={`Toca el corazón. Progreso: ${taps} de 5 latidos.`}
              className="relative flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C7A8DF] rounded-full select-none cursor-pointer active:scale-95"
            >
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full drop-shadow-md overflow-visible"
              >
                <defs>
                  {/* Vertical Clip for progressive filling */}
                  <clipPath id="heartProgressClip">
                    <rect
                      x="0"
                      y={100 - fillPercentage}
                      width="100"
                      height={fillPercentage}
                      className="transition-all duration-500 ease-out"
                    />
                  </clipPath>

                  {/* Gradient for fill */}
                  <linearGradient id="heartFillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C62E4E" />
                    <stop offset="100%" stopColor="#741C3C" />
                  </linearGradient>
                </defs>

                {/* Background empty heart base */}
                <path
                  d="M50,88 C50,88 12,62 12,34 C12,18 24,10 36,10 C43,10 48,15 50,19 C52,15 57,10 64,10 C76,10 88,18 88,34 C88,62 50,88 50,88 Z"
                  fill="#FFFDFE"
                  stroke="#741C3C"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  className="transition-colors duration-300"
                />

                {/* Progressive Fill with clipPath */}
                <path
                  d="M50,88 C50,88 12,62 12,34 C12,18 24,10 36,10 C43,10 48,15 50,19 C52,15 57,10 64,10 C76,10 88,18 88,34 C88,62 50,88 50,88 Z"
                  fill="url(#heartFillGrad)"
                  clipPath="url(#heartProgressClip)"
                />
              </svg>

              {/* Inner Tap count subtle indication */}
              {taps === 0 && (
                <span className="absolute text-xs tracking-wider font-semibold text-[#741C3C]/60 uppercase">
                  Tócame
                </span>
              )}
            </button>
          </motion.div>
        </div>

        {/* Dynamic Tap Messages */}
        <div className="mt-8 text-center min-h-[50px] flex flex-col items-center justify-center">
          {taps === 0 ? (
            <p className="text-sm font-medium tracking-wide text-[#382044] animate-pulse">
              {copy.heartGate.instruction}
            </p>
          ) : (
            <p
              key={taps}
              className="font-editorial-quote text-xl sm:text-2xl text-[#C62E4E] font-medium tracking-tight animate-fade-in"
            >
              {currentTapInfo?.text}
            </p>
          )}

          {/* Progress dots */}
          <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= taps ? "w-5 bg-[#C62E4E]" : "w-1.5 bg-[#C7A8DF]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Footer note */}
      <footer className="relative z-10 text-center pb-2">
        <p className="inline-flex items-center gap-1.5 text-xs text-[#744A8B]/70 tracking-wider uppercase font-medium">
          <PawPrint className="w-3 h-3 text-[#744A8B]/50" />
          <span>Una historia para celebrar tu vida</span>
          <PawPrint className="w-3 h-3 text-[#744A8B]/50" />
        </p>
      </footer>
    </motion.div>
  );
};
