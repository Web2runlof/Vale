import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, CheckCircle2, Sparkles } from "lucide-react";
import { birthdayConfig } from "../content/birthdayConfig";
import { easeCinematic } from "../motion/presets";

export const InteractiveQuiz: React.FC = () => {
  const { enabled, questions } = birthdayConfig.interactiveQuiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!enabled || !questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedAnswer(idx);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: easeCinematic }}
      className="py-16 px-4 max-w-xl mx-auto select-none"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-10 card-border paper-shadow text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#744A8B] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C62E4E]" />
          <span>Nuestras Anécdotas</span>
        </div>

        <h3 className="font-editorial-title text-2xl text-[#382044] mb-6">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-xl text-sm font-medium text-left transition-all ${
                  isSelected
                    ? "bg-[#741C3C] text-white shadow-sm"
                    : "bg-[#FDF8FC] text-[#382044] hover:bg-[#EADCF5]/60 border border-[#C7A8DF]/40"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 pt-4 border-t border-[#EADCF5] animate-fade-in">
            <p className="font-editorial-quote text-lg text-[#C62E4E] mb-4">
              "{currentQ.sweetReaction}"
            </p>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-[#744A8B] text-white text-xs font-medium"
              >
                Siguiente recuerdo →
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs text-[#744A8B] font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>¡Cada recuerdo a tu lado es inolvidable!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};
