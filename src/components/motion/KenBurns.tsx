import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { durations } from "../../motion/presets";

interface KenBurnsProps {
  children: React.ReactNode;
  className?: string;
  directionIndex?: number;
  duration?: number;
}

const DIRECTIONS = [
  { startX: "-1%", startY: "-1%", endX: "1.5%", endY: "1.5%" },
  { startX: "1.5%", startY: "-1.5%", endX: "-1%", endY: "1%" },
  { startX: "-1.5%", startY: "1.5%", endX: "1%", endY: "-1%" },
  { startX: "1%", startY: "1%", endX: "-1.5%", endY: "-1.5%" },
];

export const KenBurns: React.FC<KenBurnsProps> = ({
  children,
  className = "",
  directionIndex = 0,
  duration = durations.kenBurns,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  const dir = DIRECTIONS[directionIndex % DIRECTIONS.length];

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef} className={`overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full"
        style={{ willChange: isInView ? "transform" : "auto" }}
        animate={
          isInView
            ? {
                scale: [1.0, 1.12, 1.0],
                x: [dir.startX, dir.endX, dir.startX],
                y: [dir.startY, dir.endY, dir.startY],
              }
            : {}
        }
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
