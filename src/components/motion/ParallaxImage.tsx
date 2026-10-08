import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxImageProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // scale factor
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  children,
  className = "",
  speed = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Full amplitude: -12% to 12%. On mobile: -6% to 6%
  const amplitude = isMobile ? 6 * speed : 12 * speed;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${amplitude}%`, `${amplitude}%`]
  );

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
        style={{
          y,
          scale: 1.2,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
