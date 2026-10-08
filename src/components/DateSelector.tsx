import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, PawPrint } from "lucide-react";
import { birthdayConfig } from "../content/birthdayConfig";

interface DateSelectorProps {
  selectedDate: string | null;
  onSelectDate: (dateStr: string, formattedText: string) => void;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const blockedDates = new Set(birthdayConfig.gift.blockedDates || []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Day of week of first day (0 = Sunday, 1 = Monday)
  let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const handleDayClick = (dayNumber: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(dayNumber).padStart(2, "0");
    const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

    const dateObj = new Date(currentYear, currentMonth, dayNumber);
    const dayName = new Intl.DateTimeFormat("es-CO", { weekday: "long" }).format(dateObj);
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const formatted = `${capitalizedDay}, ${dayNumber} de ${MONTH_NAMES[currentMonth]} de ${currentYear}`;

    onSelectDate(isoDate, formatted);
  };

  const isDayInPast = (dayNumber: number) => {
    const checkDate = new Date(currentYear, currentMonth, dayNumber, 23, 59, 59);
    return checkDate < today;
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl p-5 card-border paper-shadow">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EADCF5]">
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-[#C62E4E]" />
          <span className="font-editorial-title text-lg font-semibold text-[#382044]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Mes anterior"
            className="p-1.5 rounded-lg text-[#744A8B] hover:bg-[#EADCF5]/60 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Mes siguiente"
            className="p-1.5 rounded-lg text-[#744A8B] hover:bg-[#EADCF5]/60 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {WEEKDAY_NAMES.map((name) => (
          <span
            key={name}
            className="text-[11px] font-semibold text-[#744A8B]/70 uppercase tracking-wider"
          >
            {name}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty padding cells for first day offset */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9 w-9" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const monthStr = String(currentMonth + 1).padStart(2, "0");
          const dayStr = String(dayNum).padStart(2, "0");
          const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

          const isPast = isDayInPast(dayNum);
          const isBlocked = blockedDates.has(isoDate);
          const isDisabled = isPast || isBlocked;
          const isSelected = selectedDate === isoDate;

          return (
            <button
              key={dayNum}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(dayNum)}
              aria-label={`Día ${dayNum} de ${MONTH_NAMES[currentMonth]}`}
              className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 select-none ${
                isDisabled
                  ? "text-[#C7A8DF]/40 cursor-not-allowed bg-transparent"
                  : isSelected
                  ? "bg-[#C62E4E] text-white shadow-md scale-105"
                  : "text-[#382044] hover:bg-[#EADCF5] cursor-pointer"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Selected Date Summary */}
      {selectedDate && (
        <div className="mt-4 pt-3 border-t border-[#EADCF5] flex items-center justify-center gap-2 text-xs text-[#741C3C] font-medium">
          <PawPrint className="w-3.5 h-3.5 text-[#C62E4E] fill-[#C62E4E]" />
          <span>Fecha seleccionada</span>
        </div>
      )}
    </div>
  );
};
