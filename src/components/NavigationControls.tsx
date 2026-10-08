import React, { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useSpring } from "motion/react";
import { Menu, X, RotateCcw, Sparkles, PawPrint } from "lucide-react";

interface NavigationControlsProps {
  onRestartExperience: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onRestartExperience,
  onScrollTo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const { scrollY, scrollYProgress } = useScroll();

  // Smooth reading progress spring
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroThreshold = window.innerHeight * 0.82;
    setIsPastHero(latest > heroThreshold);

    const diff = latest - lastScrollYRef.current;
    if (diff > 8 && latest > 160 && !mobileMenuOpen) {
      setIsHidden(true); // scrolling down
    } else if (diff < -8) {
      setIsHidden(false); // scrolling up
    }
    lastScrollYRef.current = latest;
  });

  const navLinks = [
    { id: "inicio", label: "Inicio" },
    { id: "celebracion", label: "Cumpleaños" },
    { id: "viajes", label: "Aventuras" },
    { id: "carta", label: "Tu carta" },
    { id: "mensaje", label: "Tu mensaje" },
    { id: "regalo", label: "Sorpresa" },
    { id: "contador-2027", label: "2027" },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
        isPastHero
          ? "bg-white/70 backdrop-blur-xl border-b border-[#EADCF5]/70 text-[#382044] shadow-xs"
          : "bg-transparent text-white border-b border-transparent"
      }`}
    >
      {/* Spring-based progress bar hairline */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C62E4E] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <button
          onClick={() => onScrollTo("inicio")}
          className={`inline-flex items-center gap-1.5 font-editorial-title text-xl font-bold tracking-tight transition-colors cursor-pointer ${
            isPastHero ? "text-[#382044] hover:text-[#741C3C]" : "text-white hover:text-[#EADCF5]"
          }`}
        >
          <span>Vale</span>
          <PawPrint className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
        </button>

        {/* Desktop Links */}
        <nav
          className={`hidden md:flex items-center gap-6 text-xs font-medium transition-colors ${
            isPastHero ? "text-[#744A8B]" : "text-white/80"
          }`}
        >
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className={`hover:opacity-100 transition-opacity cursor-pointer py-1 ${
                isPastHero ? "hover:text-[#382044]" : "hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRestartExperience}
            title="Reiniciar desde el corazón"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              isPastHero
                ? "text-[#744A8B] hover:text-[#741C3C] hover:bg-[#EADCF5]/60"
                : "text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú de navegación"
            className={`md:hidden p-2 transition-colors cursor-pointer ${
              isPastHero ? "text-[#382044]" : "text-white"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDF8FC] text-[#382044] border-b border-[#EADCF5] px-6 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onScrollTo(item.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-sm text-[#744A8B] hover:text-[#382044] font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[#EADCF5]">
            <button
              onClick={() => {
                onRestartExperience();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-[#741C3C] py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar desde el corazón</span>
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
};
