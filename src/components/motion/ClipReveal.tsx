import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  triggerOnScroll?: boolean;
}

export const ClipReveal: React.FC<ClipRevealProps> = ({
  children,
  className = "",
  triggerOnScroll = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"],
  });

  const clipPathScroll = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "inset(12% 12% 12% 12% round 24px)",
      "inset(0% 0% 0% 0% round 0px)",
    ]
  );

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (triggerOnScroll) {
    return (
      <div ref={containerRef} className={`overflow-hidden ${className}`}>
        <motion.div
          style={{
            clipPath: clipPathScroll,
            willChange: "clip-path",
          }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  // Viewport trigger version
  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: "inset(12% 12% 12% 12% round 24px)", opacity: 0.8 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "clip-path" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
