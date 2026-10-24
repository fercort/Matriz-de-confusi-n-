import React, { useState, useRef } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { QuizQuestion } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Printer,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export const QuizCertification: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ isCorrect: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Futuro Científico de Datos');

  const printRef = useRef<HTMLDivElement>(null);

  const question: QuizQuestion = QUIZ_QUESTIONS[currentIdx];
  const total = QUIZ_QUESTIONS.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctAnswerIndex;
    setUserAnswers((prev) => [...prev, { isCorrect }]);

    if (isCorrect) {
      sound.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      sound.playError();
    }
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIdx + 1 < total) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sound.playFanfare();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const percentage = Math.round((score / total) * 100);
  const hasPassed = percentage >= 75;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3 text-xs">
        <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-sm">
            Examen y Certificación de Ciencia de Datos
          </span>
          <p className="text-indigo-800/80 dark:text-indigo-300/80 mt-0.5 leading-relaxed">
            Pon a prueba tus conocimientos con 8 preguntas prácticas. Si obtienes al menos el <strong>75% de aciertos</strong>, obtendrás tu diploma oficial de Especialista en Matriz de Confusión.
          </p>
        </div>
      </div>

      {!isFinished ? (
        <div className="p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Pregunta {currentIdx + 1} de {total}
              </span>
              <span className="font-mono text-slate-400">
                Aciertos: {score}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Tag */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              🏷️ {question.conceptTag}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {question.question}
          </h3>

          {/* Options List */}
          <div className="space-y-2.5 pt-2">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctAnswerIndex;

              let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-400';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-400';
                } else {
                  btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-xl border-2 text-left font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">
                      {isAnswered && isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isAnswered && isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-mono text-slate-500">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      )}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation drawer */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {question.explanation}
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>{currentIdx + 1 < total ? 'Siguiente Pregunta' : 'Ver Resultados y Diploma'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results and Diploma Screen */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-3xl">
              {hasPassed ? '🎓' : '📚'}
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {hasPassed ? '¡Felicitaciones, Aprobaste el Examen!' : '¡Buen intento, sigue practicando!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Obtuviste <strong>{score} de {total}</strong> respuestas correctas ({percentage}%).
              </p>
            </div>

            {hasPassed ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 max-w-md mx-auto">
                ✨ Has desbloqueado tu Diploma de Certificación oficial. Personalízalo con tu nombre a continuación:
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 max-w-md mx-auto">
                Necesitas un 75% o más para obtener el certificado. Puedes repasar la teoría o intentarlo nuevamente.
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar Examen</span>
              </button>
            </div>
          </div>

          {/* Official Printable Diploma (If passed) */}
          {hasPassed && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="student-name-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nombre en el Diploma:
                  </label>
                  <input
                    id="student-name-input"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="Escribe tu nombre..."
                  />
                </div>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
              </div>

              {/* The Diploma Design */}
              <div
                ref={printRef}
                className="p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600/40 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-center space-y-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-4 left-4 text-3xl opacity-30 select-none">✦</div>
                <div className="absolute top-4 right-4 text-3xl opacity-30 select-none">✦</div>
                <div className="absolute bottom-4 left-4 text-3xl opacity-30 select-none">✦</div>
                <div className="absolute bottom-4 right-4 text-3xl opacity-30 select-none">✦</div>

                <div className="space-y-1">
                  <span className="text-[11px] font-black tracking-widest uppercase text-amber-700 dark:text-amber-400">
                    CERTIFICADO DE LOGRO EN CIENCIA DE DATOS & IA
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-wide">
                    ESPECIALISTA EN MATRIZ DE CONFUSIÓN
                  </h1>
                </div>

                <p className="text-xs text-slate-500 italic max-w-md mx-auto">
                  Por haber demostrado dominio absoluto de los conceptos de Verdaderos Positivos, Verdaderos Negativos, Falsos Positivos, Falsos Negativos, Precisión, Recall y F1-Score.
                </p>

                <div className="py-2">
                  <span className="text-xs uppercase text-slate-400 block tracking-widest">
                    Otorgado con distinción a:
                  </span>
                  <span className="text-2xl sm:text-4xl font-serif font-bold text-indigo-900 dark:text-indigo-200 border-b-2 border-indigo-400 pb-1 inline-block mt-1">
                    {studentName || 'Estudiante Ejemplar'}
                  </span>
                </div>

                {/* Badges in diploma */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-[11px] pt-2">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold block">Aciertos</span>
                    {score} / {total} ({percentage}%)
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                    <span className="font-bold block">Nivel</span>
                    Científico/a Jr.
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300">
                    <span className="font-bold block">Estado</span>
                    Verificado ✓
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 max-w-md mx-auto">
                  <div className="text-left">
                    <span className="block font-serif text-slate-700 dark:text-slate-300 font-bold">MatrizLab AI</span>
                    <span>Laboratorio Didáctico</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-slate-700 dark:text-slate-300 font-bold">
                      {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span>Fecha de Emisión</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
