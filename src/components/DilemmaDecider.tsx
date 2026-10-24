import React, { useState } from 'react';
import { DILEMMA_CASES } from '../data/dilemmas';
import { DilemmaCase } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Scale,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export const DilemmaDecider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  const dilemma: DilemmaCase = DILEMMA_CASES[currentIndex];

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (showExplanation) return;
    setSelectedOptionId(optionId);
    setShowExplanation(true);

    if (isCorrect) {
      sound.playSuccess();
      setCompletedCount((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
      });
    } else {
      sound.playError();
    }
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setShowExplanation(false);
    if (currentIndex + 1 < DILEMMA_CASES.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/40 flex items-start gap-3 text-xs">
        <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 dark:text-amber-200 block text-sm">
            El Dilema del Científico de Datos: ¿Qué Error Cuesta Más?
          </span>
          <p className="text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
            En la vida real, los errores no son solo matemáticas: ¡tienen consecuencias humanas, legales o financieras!
            Aprende a identificar cuándo un <strong>Falso Positivo</strong> es una simple molestia y cuándo un <strong>Falso Negativo</strong> es una tragedia irreversible.
          </p>
        </div>
      </div>

      {/* Case Navigator */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5">
          {DILEMMA_CASES.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playClick();
                setCurrentIndex(idx);
                setSelectedOptionId(null);
                setShowExplanation(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentIndex === idx
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{d.icon}</span>
              <span className="truncate max-w-[120px]">{d.title}</span>
            </button>
          ))}
        </div>

        <span className="text-slate-400 font-mono shrink-0">
          {currentIndex + 1} / {DILEMMA_CASES.length}
        </span>
      </div>

      {/* Main Dilemma Card */}
      <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {dilemma.category}
            </span>
            <span className="text-2xl">{dilemma.icon}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {dilemma.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {dilemma.scenario}
          </p>
        </div>

        {/* Side by Side Error Consequences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FP consequence */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Consecuencia de un Falso Positivo (FP)</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {dilemma.falsePositiveConsequence}
            </p>
          </div>

          {/* FN consequence */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Consecuencia de un Falso Negativo (FN)</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {dilemma.falseNegativeConsequence}
            </p>
          </div>
        </div>

        {/* The Question */}
        <div className="pt-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            🤔 {dilemma.question}
          </h4>

          <div className="space-y-2.5">
            {dilemma.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnClass = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800';

              if (showExplanation) {
                if (opt.isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-400';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-400';
                } else {
                  btnClass = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`w-full p-3.5 rounded-xl border-2 text-left font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:cursor-not-allowed ${btnClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">
                      {showExplanation && opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : showExplanation && isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Key Takeaway */}
        {showExplanation && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {dilemma.options.find((o) => o.id === selectedOptionId)?.explanation}
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Conclusión clave: {dilemma.keyTakeaway}</span>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Siguiente Caso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
