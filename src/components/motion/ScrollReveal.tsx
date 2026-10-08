import React from "react";
import { motion, useReducedMotion, type TargetAndTransition, type VariantLabels } from "motion/react";
import { easeCinematic } from "../../motion/presets";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  amount?: number | "some" | "all";
  once?: boolean;
  as?: keyof typeof motion;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.85,
  y = 28,
  x = 0,
  scale = 1,
  blur = false,
  amount = 0.15,
  once = true,
  as = "div",
  style,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = (motion[as as keyof typeof motion] || motion.div) as any;
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  const initialStyle: Record<string, any> = {
    opacity: 0,
    y,
    x,
  };

  if (scale !== 1) {
    initialStyle.scale = scale;
  }

  if (blur) {
    initialStyle.filter = "blur(8px)";
  }

  const animateStyle: Record<string, any> = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: blur ? "blur(0px)" : undefined,
  };

  const Component = (motion[as as keyof typeof motion] || motion.div) as any;

  return (
    <Component
      initial={initialStyle}
      whileInView={animateStyle}
      viewport={{ once, amount, margin: "0px 0px -40px 0px" }}
      transition={{
        duration,
        delay,
        ease: easeCinematic,
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number | "some" | "all";
  once?: boolean;
  style?: React.CSSProperties;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = "",
  stagger = 0.12,
  delay = 0,
  amount = 0.15,
  once = true,
  style,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -40px 0px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  scale?: number;
  duration?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = "",
  y = 24,
  scale = 1,
  duration = 0.8,
  style,
  onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y,
          scale: scale !== 1 ? scale : undefined,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration,
            ease: easeCinematic,
          },
        },
      }}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
