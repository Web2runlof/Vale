import React from "react";

interface SectionHeadingProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  theme?: "light" | "dark";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  subtitle,
  align = "center",
  theme = "light",
  className = "",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {tag && (
        <div
          className={`text-xs font-semibold uppercase tracking-[0.22em] mb-2.5 ${
            isDark ? "text-[#C7A8DF]" : "text-[#744A8B]"
          }`}
        >
          {tag}
        </div>
      )}

      <h2
        className={`font-editorial-title text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] text-balance ${
          isDark ? "text-white" : "text-[#382044]"
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg font-light leading-relaxed text-pretty ${
            isDark ? "text-[#EADCF5]/80" : "text-[#744A8B]/90"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
