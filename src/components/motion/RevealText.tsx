import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { easeCinematic, durations } from "../../motion/presets";
import { renderWithSmallEmojis } from "./EditorialTitle";

interface RevealTextProps {
  text: string;
  by?: "words" | "lines";
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  by = "words",
  className = "",
  as: Component = "p",
  delay = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If text has linebreaks and by is lines, split by \n
  const items = by === "lines" ? text.split("\n") : text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.02 : 0.06,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: durations.reducedMotion,
            ease: "easeOut" as const,
          },
        },
      }
    : {
        hidden: {
          y: "110%",
          opacity: 0,
        },
        visible: {
          y: "0%",
          opacity: 1,
          transition: {
            duration: durations.textReveal,
            ease: easeCinematic,
          },
        },
      };

  return (
    <Component className={className}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className={`inline-block overflow-hidden align-top pb-[0.08em] ${
              by === "words" ? "mr-[0.26em]" : "block"
            }`}
          >
            <motion.span className="inline-block" variants={itemVariants}>
              {renderWithSmallEmojis(item)}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};
