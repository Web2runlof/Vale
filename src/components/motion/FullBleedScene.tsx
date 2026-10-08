import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BirthdayPhoto } from "../../content/galleryData";
import { ImageWithFallback } from "../ImageWithFallback";
import { KenBurns } from "./KenBurns";

interface FullBleedSceneProps {
  photo: BirthdayPhoto;
  heightVh?: number; // wrapper height in vh/svh (e.g. 200 for sticky parallax layer)
  scrim?: string;
  align?: "bottom-left" | "center" | "bottom-center";
  children?: React.ReactNode;
  onClickPhoto?: (photo: BirthdayPhoto) => void;
  priority?: boolean;
  directionIndex?: number;
  id?: string;
}

export const FullBleedScene: React.FC<FullBleedSceneProps> = ({
  photo,
  heightVh = 200,
  align = "bottom-left",
  children,
  onClickPhoto,
  priority = false,
  directionIndex = 0,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isSticky = heightVh > 100;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Zoom-out from 1.15 to 1.0 as user scrolls
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);

  // Progressive darkening scrim on exit
  const scrimOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [0.75, 0.85, 0.96]
  );

  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-18%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const alignmentClasses = {
    "bottom-left": "items-end justify-start text-left pb-16 sm:pb-20 px-6 sm:px-12 lg:px-16",
    center: "items-center justify-center text-center p-6 sm:p-12",
    "bottom-center": "items-end justify-center text-center pb-16 sm:pb-20 px-6 sm:px-12",
  }[align];

  return (
    <div
      id={id}
      ref={containerRef}
      style={{ minHeight: `${heightVh}svh` }}
      className="relative w-full overflow-visible select-none"
    >
      {/* Sticky Full-Viewport Viewport */}
      <div className={`${isSticky ? "sticky top-0" : "relative"} h-[100svh] w-full overflow-hidden`}>
        {/* Animated Photo Background */}
        <motion.div
          style={{
            scale: shouldReduceMotion ? 1 : scrollScale,
            willChange: "transform",
          }}
          className="absolute inset-0 w-full h-full"
        >
          <KenBurns directionIndex={directionIndex} className="w-full h-full">
            <div
              onClick={() => onClickPhoto?.(photo)}
              className={`w-full h-full ${onClickPhoto ? "cursor-pointer" : ""}`}
            >
              <ImageWithFallback
                photo={photo}
                priority={priority}
                aspectRatioClass="h-full w-full"
                className="h-full w-full rounded-none border-none"
              />
            </div>
          </KenBurns>
        </motion.div>

        {/* Cinematic Scrim Gradient: top rgba(28,14,36,.35) to bottom rgba(28,14,36,.85) */}
        <motion.div
          style={{
            opacity: shouldReduceMotion ? 0.8 : scrimOpacity,
          }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[rgba(28,14,36,0.35)] via-[rgba(28,14,36,0.55)] to-[rgba(28,14,36,0.88)]"
        />

        {/* Subtle radial vignette */}
        <div className="absolute inset-0 pointer-events-none vignette-scrim" />

        {/* Foreground Content Layer */}
        {children && (
          <div className={`absolute inset-0 flex ${alignmentClasses} z-10 pointer-events-none`}>
            <motion.div
              style={{
                y: shouldReduceMotion ? 0 : textY,
                opacity: shouldReduceMotion ? 1 : textOpacity,
              }}
              className="pointer-events-auto max-w-3xl"
            >
              {children}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
