import React from "react";
import { PawPrint } from "lucide-react";

export const AmbientPawPrints: React.FC = () => {
  // Gentle background paw prints positioned down the long page
  const pawPoints = [
    { top: "8%", left: "4%", rotate: -18, size: 36, opacity: 0.12 },
    { top: "9.5%", left: "6%", rotate: 12, size: 32, opacity: 0.10 },
    { top: "18%", right: "5%", rotate: 22, size: 40, opacity: 0.11 },
    { top: "19.5%", right: "7%", rotate: -14, size: 34, opacity: 0.09 },
    { top: "31%", left: "3%", rotate: -25, size: 38, opacity: 0.13 },
    { top: "32.5%", left: "5.5%", rotate: 10, size: 32, opacity: 0.10 },
    { top: "45%", right: "4%", rotate: 18, size: 42, opacity: 0.12 },
    { top: "46.5%", right: "6.5%", rotate: -16, size: 35, opacity: 0.09 },
    { top: "58%", left: "4.5%", rotate: -15, size: 36, opacity: 0.11 },
    { top: "59.5%", left: "7%", rotate: 15, size: 32, opacity: 0.09 },
    { top: "72%", right: "5%", rotate: 20, size: 38, opacity: 0.12 },
    { top: "73.5%", right: "7.5%", rotate: -12, size: 34, opacity: 0.10 },
    { top: "85%", left: "3.5%", rotate: -20, size: 40, opacity: 0.13 },
    { top: "86.5%", left: "6%", rotate: 14, size: 34, opacity: 0.10 },
    { top: "94%", right: "6%", rotate: 24, size: 36, opacity: 0.12 },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {pawPoints.map((paw, idx) => (
        <div
          key={idx}
          className="absolute text-[#744A8B] transition-opacity duration-700"
          style={{
            top: paw.top,
            left: paw.left,
            right: paw.right,
            transform: `rotate(${paw.rotate}deg)`,
            opacity: paw.opacity,
          }}
        >
          <PawPrint
            style={{ width: paw.size, height: paw.size }}
            className="fill-[#C7A8DF]/60"
          />
        </div>
      ))}
    </div>
  );
};
