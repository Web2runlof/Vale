import React from "react";

// Regex matches common emoji patterns like ❤️, ✨, 🎁, etc.
const EMOJI_REGEX = /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}|❤️|✨|🎁|🕊️|💍|🥂|🎂)/gu;

interface EditorialTitleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export const renderWithSmallEmojis = (text: string) => {
  const parts = text.split(EMOJI_REGEX);
  return parts.map((part, index) => {
    if (EMOJI_REGEX.test(part)) {
      return (
        <span
          key={index}
          className="inline-block text-[0.55em] align-baseline mx-0.5 select-none"
          aria-hidden="true"
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const EditorialTitle: React.FC<EditorialTitleProps> = ({
  text,
  className = "",
  as: Component = "h2",
}) => {
  return <Component className={className}>{renderWithSmallEmojis(text)}</Component>;
};
