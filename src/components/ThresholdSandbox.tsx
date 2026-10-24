import React, { useState, useMemo } from 'react';
import { SandboxPoint, MatrixCounts } from '../types';
import { calculateMetrics } from '../utils/metrics';
import { MatrixHeatmap } from './MatrixHeatmap';
import { MetricCards } from './MetricCards';
import { sound } from '../utils/sound';
import { Sliders, RefreshCw, Zap, ShieldAlert, Sparkles, Filter } from 'lucide-react';

// Generates simulated dataset
function generateDataset(type: 'balanced' | 'imbalanced'): SandboxPoint[] {
  const points: SandboxPoint[] = [];
  let idCounter = 1;

  if (type === 'balanced') {
    // 25 Negativos (normal distribution centered around 0.32, sd 0.16)
    for (let i = 0; i < 25; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      let score = 0.32 + z * 0.16;
      score = Math.max(0.02, Math.min(0.98, score));
      points.push({
        id: idCounter++,
        actual: 'negative',
        score: Math.round(score * 100) / 100,
        label: `Caso Sano #${idCounter}`,
      });
    }

    // 25 Positivos (normal distribution centered around 0.68, sd 0.16)
    for (let i = 0; i < 25; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      let score = 0.68 + z * 0.16;
      score = Math.max(0.02, Math.min(0.98, score));
      points.push({
        id: idCounter++,
        actual: 'positive',
        score: Math.round(score * 100) / 100,
        label: `Caso Positivo #${idCounter}`,
      });
    }
  } else {
    // Imbalanced: 45 Negativos, 5 Positivos
    for (let i = 0; i < 45; i++) {
      const score = Math.max(0.01, Math.min(0.75, 0.25 + (Math.random() - 0.5) * 0.3));
      points.push({
        id: idCounter++,
        actual: 'negative',
        score: Math.round(score * 100) / 100,
        label: `Caso Sano #${idCounter}`,
      });
    }
    for (let i = 0; i < 5; i++) {
      const score = Math.max(0.3, Math.min(0.99, 0.72 + (Math.random() - 0.5) * 0.3));
      points.push({
        id: idCounter++,
        actual: 'positive',
        score: Math.round(score * 100) / 100,
        label: `Caso Positivo Raro #${idCounter}`,
      });
    }
  }

  // Sort by score ascending for smooth distribution
  return points.sort((a, b) => a.score - b.score);
}

export const ThresholdSandbox: React.FC = () => {
  const [datasetType, setDatasetType] = useState<'balanced' | 'imbalanced'>('balanced');
  const [threshold, setThreshold] = useState<number>(0.5);
  const [datasetSeed, setDatasetSeed] = useState<number>(0);

  // Generate points
  const points = useMemo(() => {
    return generateDataset(datasetType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetType, datasetSeed]);

  // Compute confusion matrix based on threshold
  const { counts, pointClassifications } = useMemo(() => {
    let tp = 0;
    let tn = 0;
    let fp = 0;
    let fn = 0;

    const classifications = points.map((p) => {
      const predictedPositive = p.score >= threshold;
      let quadrant: 'TP' | 'TN' | 'FP' | 'FN';

      if (p.actual === 'positive') {
        if (predictedPositive) {
          quadrant = 'TP';
          tp++;
        } else {
          quadrant = 'FN';
          fn++;
        }
      } else {
        if (predictedPositive) {
          quadrant = 'FP';
          fp++;
        } else {
          quadrant = 'TN';
          tn++;
        }
      }

      return {
        ...p,
        predictedPositive,
        quadrant,
      };
    });

    return {
      counts: { tp, tn, fp, fn },
      pointClassifications: classifications,
    };
  }, [points, threshold]);

  const metrics = calculateMetrics(counts);

  const handleThresholdChange = (newVal: number) => {
    sound.playTick();
    setThreshold(newVal);
  };

  const handleRegenerate = () => {
    sound.playClick();
    setDatasetSeed((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50/80 to-purple-50/80 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100 dark:border-violet-900/40 flex items-start gap-3 text-xs">
        <Sliders className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-violet-950 dark:text-violet-200 block text-sm">
            Laboratorio Interactivo de Umbral de Decisión (Threshold)
          </span>
          <p className="text-violet-800/80 dark:text-violet-300/80 mt-0.5 leading-relaxed">
            Una IA no dice simplemente "SÍ" o "NO", sino que calcula una probabilidad del 0% al 100%. 
            ¡Tú decides la línea de corte (umbral)! Desliza la barra para ver cómo se mueven los casos entre los 4 cuadrantes y cómo impacta en la <strong>Precisión</strong> y el <strong>Recall</strong>.
          </p>
        </div>
      </div>

      {/* Preset Buttons & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Ajustes rápidos:
          </span>
          <button
            onClick={() => handleThresholdChange(0.5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              threshold === 0.5
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            ⚖️ Estándar (0.50)
          </button>
          <button
            onClick={() => handleThresholdChange(0.25)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              threshold === 0.25
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            🚨 Máximo Recall (0.25 - Sin Falsos Negativos)
          </button>
          <button
            onClick={() => handleThresholdChange(0.75)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              threshold === 0.75
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            🎯 Máxima Precisión (0.75 - Cero Falsas Alarmas)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Dataset toggle */}
          <div className="flex items-center p-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setDatasetType('balanced');
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                datasetType === 'balanced'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              50/50 Equilibrado
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setDatasetType('imbalanced');
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                datasetType === 'imbalanced'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              ⚠️ Desbalanceado (90/10)
            </button>
          </div>

          <button
            onClick={handleRegenerate}
            title="Generar nueva muestra de datos"
            className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Visualizer */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        {/* Slider Controls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Umbral de Decisión (Threshold)
            </span>
            <span className="font-mono text-lg font-black text-indigo-600 dark:text-indigo-400">
              {threshold.toFixed(2)} ({Math.round(threshold * 100)}%)
            </span>
          </div>

          <div className="relative py-2">
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={threshold}
              onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-hidden"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.00 (La IA predice TODO Positivo)</span>
              <span>0.50 (Mitad)</span>
              <span>1.00 (La IA predice TODO Negativo)</span>
            </div>
          </div>
        </div>

        {/* 1D Scatter Distribution Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Distribución de {points.length} casos según su probabilidad calculada por la IA:</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>VP ({counts.tp})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>FN ({counts.fn})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>FP ({counts.fp})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>VN ({counts.tn})</span>
              </span>
            </div>
          </div>

          {/* Graphical canvas area */}
          <div className="relative h-44 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 overflow-hidden select-none">
            {/* Background region zones */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-blue-50/50 dark:bg-blue-950/20 border-r border-dashed border-indigo-400"
              style={{ width: `${threshold * 100}%` }}
            >
              <div className="p-2 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                ← Zona de Predicción NEGATIVA (Puntaje &lt; {threshold.toFixed(2)})
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 right-0 bg-indigo-50/50 dark:bg-indigo-950/20"
              style={{ width: `${(1 - threshold) * 100}%` }}
            >
              <div className="p-2 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 text-right">
                Zona de Predicción POSITIVA (Puntaje ≥ {threshold.toFixed(2)}) →
              </div>
            </div>

            {/* Threshold dividing line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-600 dark:bg-indigo-400 z-10 transition-all pointer-events-none"
              style={{ left: `${threshold * 100}%` }}
            >
              <div className="absolute -top-1 -translate-x-1/2 bg-indigo-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-sm shadow-xs font-bold">
                Corte {threshold.toFixed(2)}
              </div>
            </div>

            {/* Data Points plotted */}
            <div className="absolute inset-0 pt-8 px-4 pb-4 flex items-center">
              <div className="w-full relative h-24">
                {pointClassifications.map((p, idx) => {
                  const leftPercent = p.score * 100;
                  // Calculate dynamic vertical stagger based on actual class to separate rows
                  const topOffset = p.actual === 'positive' ? 14 + (idx % 3) * 12 : 55 + (idx % 3) * 12;

                  let dotColor = 'bg-slate-400';
                  let ringColor = '';
                  let shape = 'rounded-full';

                  if (p.quadrant === 'TP') {
                    dotColor = 'bg-emerald-500 shadow-emerald-400/50';
                    ringColor = 'ring-2 ring-emerald-300';
                  } else if (p.quadrant === 'TN') {
                    dotColor = 'bg-blue-500 shadow-blue-400/50';
                    ringColor = 'ring-2 ring-blue-300';
                  } else if (p.quadrant === 'FP') {
                    dotColor = 'bg-amber-500 shadow-amber-400/50';
                    ringColor = 'ring-2 ring-amber-300';
                  } else if (p.quadrant === 'FN') {
                    dotColor = 'bg-rose-500 shadow-rose-400/50 animate-pulse';
                    ringColor = 'ring-2 ring-rose-400';
                  }

                  return (
                    <div
                      key={p.id}
                      className={`absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 ${shape} ${dotColor} ${ringColor} shadow-xs cursor-pointer transition-all duration-200 hover:scale-175 z-20 group`}
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topOffset}px`,
                      }}
                    >
                      {/* Hover Tooltip */}
                      <div className="hidden group-hover:block absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md shadow-lg whitespace-nowrap pointer-events-none">
                        <span className="font-bold">{p.quadrant}</span> · Score: {p.score.toFixed(2)} · Real: {p.actual}
                      </div>
                    </div>
                  );
                })}

                {/* Legend tracks */}
                <div className="absolute left-1 top-2 text-[10px] font-semibold text-slate-400 uppercase">
                  Fila: Casos Positivos Reales (+)
                </div>
                <div className="absolute left-1 bottom-0 text-[10px] font-semibold text-slate-400 uppercase">
                  Fila: Casos Negativos Reales (-)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Insight Banner based on threshold position */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          {threshold <= 0.3 ? (
            <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Umbral Muy Bajo (Sensible / Paranoico):</strong> La IA casi no deja pasar nada.
                El Recall es altísimo ({((counts.tp / (counts.tp + counts.fn || 1)) * 100).toFixed(0)}%),
                los Falsos Negativos son casi cero, ¡pero sufres de muchas Falsas Alarmas (Falsos Positivos = {counts.fp})!
              </div>
            </div>
          ) : threshold >= 0.7 ? (
            <div className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
              <Zap className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Umbral Muy Alto (Estricto / Conservador):</strong> La IA solo da la alerta cuando está ultra-segura.
                La Precisión es altísima ({((counts.tp / (counts.tp + counts.fp || 1)) * 100).toFixed(0)}%),
                casi no hay Falsas Alarmas, ¡pero se le escapan muchos casos reales (Falsos Negativos = {counts.fn})!
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Umbral Equilibrado (0.50):</strong> Punto medio estándar entre Precisión y Recall.
                Observa cómo el F1-Score busca armonizar ambos mundos.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Synchronized Live Confusion Matrix & Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
            Matriz de Confusión Resultante (Corte en {threshold.toFixed(2)})
          </h3>
          <MatrixHeatmap counts={counts} />
        </div>

        <div className="lg:col-span-7">
          <MetricCards counts={counts} metrics={metrics} />
        </div>
      </div>
    </div>
  );
};
