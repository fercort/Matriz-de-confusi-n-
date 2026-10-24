import React from 'react';
import { MatrixCounts } from '../types';
import { QUADRANT_EXPLANATIONS } from '../data/concepts';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface MatrixHeatmapProps {
  counts: MatrixCounts;
  highlightQuadrant?: 'TP' | 'TN' | 'FP' | 'FN' | null;
  onSelectQuadrant?: (quadrant: 'TP' | 'TN' | 'FP' | 'FN') => void;
  positiveLabel?: string;
  negativeLabel?: string;
  compact?: boolean;
}

export const MatrixHeatmap: React.FC<MatrixHeatmapProps> = ({
  counts,
  highlightQuadrant,
  onSelectQuadrant,
  positiveLabel = 'Positivo (Condición)',
  negativeLabel = 'Negativo (Normal)',
  compact = false,
}) => {
  const total = counts.tp + counts.tn + counts.fp + counts.fn;
  const realPositives = counts.tp + counts.fn;
  const realNegatives = counts.fp + counts.tn;
  const predPositives = counts.tp + counts.fp;
  const predNegatives = counts.fn + counts.tn;

  const getIntensity = (val: number) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((val / total) * 100));
  };

  return (
    <div className="w-full select-none">
      <div className="text-center mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          PREDICCIÓN DE LA INTELIGENCIA ARTIFICIAL
        </span>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-stretch text-sm">
        {/* Header row */}
        <div className="p-1"></div>
        <div className="text-center p-2 rounded-t-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Predijo SÍ</div>
          <div className="font-semibold truncate text-xs sm:text-sm">{positiveLabel}</div>
        </div>
        <div className="text-center p-2 rounded-t-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Predijo NO</div>
          <div className="font-semibold truncate text-xs sm:text-sm">{negativeLabel}</div>
        </div>
        <div className="hidden sm:flex items-center justify-center text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
          Total Real
        </div>

        {/* Row 1: Real Positive */}
        <div className="flex flex-col justify-center items-end pr-2 font-medium text-slate-700 dark:text-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400">Realidad</span>
          <span className="font-semibold text-xs sm:text-sm text-right truncate max-w-[90px] sm:max-w-none">
            SÍ ({positiveLabel})
          </span>
        </div>

        {/* Top-Left: Verdadero Positivo (TP) */}
        <button
          type="button"
          onClick={() => onSelectQuadrant?.('TP')}
          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer
            ${highlightQuadrant === 'TP' ? 'ring-4 ring-emerald-400 scale-[1.02] shadow-lg' : 'hover:scale-[1.01] shadow-sm'}
            border-emerald-500/50 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              VP (Verdadero Positivo)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {getIntensity(counts.tp)}%
            </span>
          </div>
          <div className="my-1 sm:my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
              {counts.tp}
            </span>
            {!compact && (
              <span className="text-[11px] block text-emerald-600/80 dark:text-emerald-400/80">
                ¡Acierto! Era SÍ y dijo SÍ
              </span>
            )}
          </div>
        </button>

        {/* Top-Right: Falso Negativo (FN) */}
        <button
          type="button"
          onClick={() => onSelectQuadrant?.('FN')}
          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer
            ${highlightQuadrant === 'FN' ? 'ring-4 ring-rose-400 scale-[1.02] shadow-lg' : 'hover:scale-[1.01] shadow-sm'}
            border-rose-500/50 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              FN (Falso Negativo)
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
              {getIntensity(counts.fn)}%
            </span>
          </div>
          <div className="my-1 sm:my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-300">
              {counts.fn}
            </span>
            {!compact && (
              <span className="text-[11px] block text-rose-600/80 dark:text-rose-400/80">
                ¡Peligro! Era SÍ y dijo NO (Error II)
              </span>
            )}
          </div>
        </button>

        {/* Row 1 marginal total */}
        <div className="hidden sm:flex flex-col justify-center items-center px-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-sm">
          <span className="font-bold">{realPositives}</span>
          <span className="text-[10px] text-slate-400">Reales (+)</span>
        </div>

        {/* Row 2: Real Negative */}
        <div className="flex flex-col justify-center items-end pr-2 font-medium text-slate-700 dark:text-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400">Realidad</span>
          <span className="font-semibold text-xs sm:text-sm text-right truncate max-w-[90px] sm:max-w-none">
            NO ({negativeLabel})
          </span>
        </div>

        {/* Bottom-Left: Falso Positivo (FP) */}
        <button
          type="button"
          onClick={() => onSelectQuadrant?.('FP')}
          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer
            ${highlightQuadrant === 'FP' ? 'ring-4 ring-amber-400 scale-[1.02] shadow-lg' : 'hover:scale-[1.01] shadow-sm'}
            border-amber-500/50 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              FP (Falso Positivo)
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
              {getIntensity(counts.fp)}%
            </span>
          </div>
          <div className="my-1 sm:my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-300">
              {counts.fp}
            </span>
            {!compact && (
              <span className="text-[11px] block text-amber-600/80 dark:text-amber-400/80">
                ¡Falsa Alarma! Era NO y dijo SÍ (Error I)
              </span>
            )}
          </div>
        </button>

        {/* Bottom-Right: Verdadero Negativo (VN) */}
        <button
          type="button"
          onClick={() => onSelectQuadrant?.('TN')}
          className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer
            ${highlightQuadrant === 'TN' ? 'ring-4 ring-blue-400 scale-[1.02] shadow-lg' : 'hover:scale-[1.01] shadow-sm'}
            border-blue-500/50 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              VN (Verdadero Negativo)
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
              {getIntensity(counts.tn)}%
            </span>
          </div>
          <div className="my-1 sm:my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
              {counts.tn}
            </span>
            {!compact && (
              <span className="text-[11px] block text-blue-600/80 dark:text-blue-400/80">
                ¡Correcto! Era NO y dijo NO
              </span>
            )}
          </div>
        </button>

        {/* Row 2 marginal total */}
        <div className="hidden sm:flex flex-col justify-center items-center px-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-sm">
          <span className="font-bold">{realNegatives}</span>
          <span className="text-[10px] text-slate-400">Reales (-)</span>
        </div>

        {/* Bottom Marginal Row */}
        <div className="hidden sm:block"></div>
        <div className="hidden sm:flex flex-col justify-center items-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-b-lg text-slate-700 dark:text-slate-300 font-mono text-xs">
          <span className="font-bold">{predPositives}</span>
          <span className="text-[10px] text-slate-400">Predichos (+)</span>
        </div>
        <div className="hidden sm:flex flex-col justify-center items-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-b-lg text-slate-700 dark:text-slate-300 font-mono text-xs">
          <span className="font-bold">{predNegatives}</span>
          <span className="text-[10px] text-slate-400">Predichos (-)</span>
        </div>
        <div className="hidden sm:flex flex-col justify-center items-center py-2 bg-slate-200 dark:bg-slate-700 rounded-b-lg text-slate-800 dark:text-white font-mono text-xs font-bold">
          {total}
          <span className="text-[9px] uppercase font-normal text-slate-500 dark:text-slate-300">Total</span>
        </div>
      </div>

      {highlightQuadrant && (
        <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-bold text-slate-900 dark:text-white">
            {QUADRANT_EXPLANATIONS[highlightQuadrant].name}:
          </span>{' '}
          <span className="text-slate-600 dark:text-slate-300">
            {QUADRANT_EXPLANATIONS[highlightQuadrant].description}
          </span>
        </div>
      )}
    </div>
  );
};
