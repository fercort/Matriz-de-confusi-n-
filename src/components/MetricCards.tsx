import React, { useState } from 'react';
import { CalculatedMetrics, MatrixCounts } from '../types';
import { formatPercent } from '../utils/metrics';
import { Info, HelpCircle, CheckCircle, Target, Sparkles, Activity } from 'lucide-react';

interface MetricCardsProps {
  counts: MatrixCounts;
  metrics: CalculatedMetrics;
  onHoverMetric?: (metricName: string | null) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  counts,
  metrics,
  onHoverMetric,
}) => {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const { tp, tn, fp, fn } = counts;
  const isAccuracyParadox =
    (tp + fn) > 0 &&
    (tn + fp) > 0 &&
    (tn / (tp + tn + fp + fn) > 0.85) &&
    metrics.recall < 0.3;

  const cards = [
    {
      id: 'accuracy',
      name: 'Exactitud (Accuracy)',
      value: metrics.accuracy,
      icon: CheckCircle,
      accent: 'text-indigo-600 dark:text-indigo-400',
      bgBar: 'bg-indigo-500',
      fraction: `(${tp} + ${tn}) / ${metrics.total}`,
      formula: '(VP + VN) / Total',
      simpleMeaning: 'Porcentaje global de aciertos del modelo.',
      detail:
        'Suma todos los aciertos (positivos y negativos) y los divide entre el total de casos.',
      warning: isAccuracyParadox
        ? '¡ALERTA DE PARADOJA! Tu exactitud es alta porque la gran mayoría de casos son negativos, pero casi no detectas los casos positivos.'
        : null,
    },
    {
      id: 'precision',
      name: 'Precisión (Precision)',
      value: metrics.precision,
      icon: Target,
      accent: 'text-emerald-600 dark:text-emerald-400',
      bgBar: 'bg-emerald-500',
      fraction: `${tp} / (${tp} + ${fp})`,
      formula: 'VP / (VP + FP)',
      simpleMeaning: 'De todas las alertas emitidas, ¿cuántas eran reales?',
      detail:
        'Mide la confiabilidad de la alarma. Si es baja, hay muchas falsas alarmas (Falsos Positivos).',
      warning: null,
    },
    {
      id: 'recall',
      name: 'Sensibilidad (Recall)',
      value: metrics.recall,
      icon: Sparkles,
      accent: 'text-rose-600 dark:text-rose-400',
      bgBar: 'bg-rose-500',
      fraction: `${tp} / (${tp} + ${fn})`,
      formula: 'VP / (VP + FN)',
      simpleMeaning: 'De todos los casos positivos reales, ¿cuántos atrapó?',
      detail:
        'Capacidad de no dejar escapar peligros. Si es bajo, muchos positivos se escapan sin detectar (Falsos Negativos).',
      warning: null,
    },
    {
      id: 'f1',
      name: 'F1-Score (Balance)',
      value: metrics.f1Score,
      icon: Activity,
      accent: 'text-purple-600 dark:text-purple-400',
      bgBar: 'bg-purple-500',
      fraction: `2 × (${formatPercent(metrics.precision)} × ${formatPercent(metrics.recall)}) / (${formatPercent(metrics.precision)} + ${formatPercent(metrics.recall)})`,
      formula: '2 × (P × R) / (P + R)',
      simpleMeaning: 'Promedio armónico entre Precisión y Recall.',
      detail:
        'Es el juez de oro: si la precisión o el recall caen a cero, el F1-Score castiga duramente el resultado.',
      warning: null,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.id}
            onMouseEnter={() => onHoverMetric?.(c.id)}
            onMouseLeave={() => onHoverMetric?.(null)}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <c.icon className={`w-4 h-4 ${c.accent}`} />
                  {c.name}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveInfo(activeInfo === c.id ? null : c.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={`Detalles de ${c.name}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatPercent(c.value)}
                </span>
                <span className="text-[11px] font-mono text-slate-400 truncate">
                  = {c.fraction}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bgBar} transition-all duration-300`}
                  style={{ width: `${Math.min(100, Math.max(0, c.value * 100))}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {c.simpleMeaning}
              </p>
            </div>

            {c.warning && (
              <div className="mt-2.5 p-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-[10px] text-amber-800 dark:text-amber-200 leading-tight">
                {c.warning}
              </div>
            )}

            {activeInfo === c.id && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-mono text-[10px] text-slate-500">Fórmula: {c.formula}</div>
                <div>{c.detail}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
