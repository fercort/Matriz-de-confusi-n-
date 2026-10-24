import React, { useState } from 'react';
import { QUADRANT_EXPLANATIONS, PEDRO_AND_WOLF_STORY, METRIC_EXPLANATIONS } from '../data/concepts';
import { MatrixHeatmap } from './MatrixHeatmap';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export const TheoryGuide: React.FC = () => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<'TP' | 'TN' | 'FP' | 'FN'>('TP');

  const demoCounts = {
    tp: 45,
    tn: 40,
    fp: 10,
    fn: 5,
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-3 text-xs">
        <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-950 dark:text-emerald-200 block text-sm">
            Academia Visual de la Matriz de Confusión
          </span>
          <p className="text-emerald-800/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
            ¿Por qué se llama "Matriz de Confusión"? Porque mide exactamente en qué se <em>confunde</em> la Inteligencia Artificial cuando intenta clasificar el mundo.
            ¡Domina los conceptos con trucos mentales y analogías visuales que nunca olvidarás!
          </p>
        </div>
      </div>

      {/* Golden Rule Section */}
      <div className="p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>El Truco Definitivo: La Regla de las Dos Palabras</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Cómo descifrar cualquier término en 3 segundos
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Los nombres en ciencia de datos parecen trabalenguas, pero siguen una lógica perfecta de dos partes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              1ª PALABRA: ¿La IA tuvo razón?
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-emerald-600 dark:text-emerald-400">Verdadero:</strong> La IA acertó de pleno. La realidad coincidió con su predicción.
              </div>
              <div>
                <strong className="text-rose-600 dark:text-rose-400">Falso:</strong> La IA se equivocó. Lo que dijo no correspondía con la realidad.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              2ª PALABRA: ¿Qué dijo la IA que era?
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-purple-600 dark:text-purple-400">Positivo:</strong> La IA dijo "¡SÍ!" (detectó el evento, enfermedad, amenaza o condición).
              </div>
              <div>
                <strong className="text-blue-600 dark:text-blue-400">Negativo:</strong> La IA dijo "¡NO!" (no hay nada, caso normal, sano o inofensivo).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedro y el Lobo Story */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            La Fábula Mnemotécnica
          </span>
          <span>Pedro y el Lobo 🐺</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {PEDRO_AND_WOLF_STORY.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {PEDRO_AND_WOLF_STORY.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Act 1 */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
              {PEDRO_AND_WOLF_STORY.act1.title}
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {PEDRO_AND_WOLF_STORY.act1.text}
            </p>
            <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/40 text-[11px] font-bold text-amber-900 dark:text-amber-200">
              💡 {PEDRO_AND_WOLF_STORY.act1.moral}
            </div>
          </div>

          {/* Act 2 */}
          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 space-y-2">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">
              {PEDRO_AND_WOLF_STORY.act2.title}
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {PEDRO_AND_WOLF_STORY.act2.text}
            </p>
            <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-900/40 text-[11px] font-bold text-rose-900 dark:text-rose-200">
              ⚠️ {PEDRO_AND_WOLF_STORY.act2.moral}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quadrant Explorer */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Explora los 4 Cuadrantes en la Matriz
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Haz clic en cualquiera de las cuatro celdas para ver su análisis profundo y ejemplos de la vida real:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <MatrixHeatmap
            counts={demoCounts}
            highlightQuadrant={selectedQuadrant}
            onSelectQuadrant={(q) => setSelectedQuadrant(q)}
          />

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {QUADRANT_EXPLANATIONS[selectedQuadrant].name}
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {QUADRANT_EXPLANATIONS[selectedQuadrant].code}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {QUADRANT_EXPLANATIONS[selectedQuadrant].description}
            </p>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <strong className="text-slate-900 dark:text-white block">Ejemplo cotidiano:</strong>
              <span className="text-slate-600 dark:text-slate-300">
                {QUADRANT_EXPLANATIONS[selectedQuadrant].example}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Regla: {QUADRANT_EXPLANATIONS[selectedQuadrant].rule}
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Paradox Section */}
      <div className="p-6 rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>El Gran Peligro: La Paradoja de la Exactitud (Accuracy Paradox)</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          ¿Por qué tener 99% de exactitud puede ser un desastre total?
        </h3>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Imagina que construyes una IA para detectar una enfermedad rara que solo tiene <strong>1 persona de cada 100</strong> (1% de la población).
        </p>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white">
            El "Modelo Vago":
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Un programador flojo crea una IA que <em>siempre</em> responde: "Usted está sano" sin examinar a nadie.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
            <li>De 100 personas, acierta en las 99 sanas. ¡Su <strong>Exactitud es del 99%</strong>!</li>
            <li>Pero a la única persona enferma le dijo que estaba sana (Falso Negativo).</li>
            <li>Su <strong>Recall es 0%</strong>: no curó a nadie.</li>
          </ul>
        </div>

        <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold">
          Conclusión: ¡Nunca te fíes solo de la exactitud cuando los datos están desbalanceados! Siempre revisa la Precisión, el Recall y el F1-Score.
        </p>
      </div>

      {/* Metric Dictionary Table */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Diccionario de Fórmulas y Métricas
        </h3>

        <div className="space-y-3">
          {METRIC_EXPLANATIONS.map((m) => (
            <div
              key={m.name}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {m.name}
                </span>
                <span className="font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  {m.formula}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{m.definition}</p>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                🎯 {m.analogy}
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-300">
                ⚠️ {m.danger}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
