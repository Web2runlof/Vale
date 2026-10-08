import React from "react";
import { PawPrint } from "lucide-react";
import { motion } from "motion/react";

interface DogPawProps {
  className?: string;
  size?: number;
  color?: string;
  fill?: string;
  rotate?: number;
  animated?: boolean;
}

export const DogPaw: React.FC<DogPawProps> = ({
  className = "",
  size = 20,
  color = "currentColor",
  fill = "currentColor",
  rotate = 0,
  animated = false,
}) => {
  if (animated) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [rotate - 3, rotate + 3, rotate - 3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`inline-flex items-center justify-center ${className}`}
        style={{ transformOrigin: "center center" }}
      >
        <PawPrint
          size={size}
          color={color}
          fill={fill}
          style={{ transform: `rotate(${rotate}deg)` }}
        />
      </motion.div>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <PawPrint size={size} color={color} fill={fill} />
    </span>
  );
};

// Walking paws trail (e.g. left paw, right paw, left paw...)
interface WalkingPawsTrailProps {
  count?: number;
  className?: string;
  pawSize?: number;
  orientation?: "horizontal" | "vertical" | "diagonal";
  color?: string;
  fill?: string;
  opacity?: number;
}

export const WalkingPawsTrail: React.FC<WalkingPawsTrailProps> = ({
  count = 6,
  className = "",
  pawSize = 22,
  orientation = "horizontal",
  color = "#744A8B",
  fill = "#C7A8DF",
  opacity = 0.22,
}) => {
  const paws = Array.from({ length: count });

  if (orientation === "vertical") {
    return (
      <div
        className={`flex flex-col items-center gap-6 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        {paws.map((_, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={i}
              className={`transition-transform ${
                isLeft ? "-translate-x-3 rotate-[-12deg]" : "translate-x-3 rotate-[12deg]"
              }`}
            >
              <DogPaw
                size={pawSize}
                color={color}
                fill={fill}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-5 pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {paws.map((_, i) => {
        const isUp = i % 2 === 0;
        return (
          <div
            key={i}
            className={`transition-transform ${
              isUp ? "-translate-y-2 rotate-[-15deg]" : "translate-y-2 rotate-[15deg]"
            }`}
          >
            <DogPaw
              size={pawSize}
              color={color}
              fill={fill}
            />
          </div>
        );
      })}
    </div>
  );
};
