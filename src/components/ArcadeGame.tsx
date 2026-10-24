import React, { useState } from 'react';
import { GameCase, MatrixCounts, MatrixQuadrant, ScenarioTheme } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { QUADRANT_EXPLANATIONS } from '../data/concepts';
import { sound } from '../utils/sound';
import { calculateMetrics, formatPercent } from '../utils/metrics';
import { MatrixHeatmap } from './MatrixHeatmap';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Brain,
  HelpCircle,
  Play,
  Gamepad2,
  ChevronLeft,
  Compass,
  Lightbulb,
} from 'lucide-react';

export const ArcadeGame: React.FC = () => {
  // Game state: 'welcome' (start screen) | 'playing' (game loop) | 'completed' (results)
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'completed'>('welcome');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const [caseIndex, setCaseIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{
    isCorrect: boolean;
    chosen: MatrixQuadrant;
    correctQuadrant: MatrixQuadrant;
    explanation: string;
  } | null>(null);

  const [matrixCounts, setMatrixCounts] = useState<MatrixCounts>({
    tp: 0,
    tn: 0,
    fp: 0,
    fn: 0,
  });

  const [showHint, setShowHint] = useState<boolean>(false);

  const currentCase: GameCase | undefined = scenario.cases[caseIndex];

  // Helper to determine the true quadrant of a case
  const getCorrectQuadrant = (item: GameCase): MatrixQuadrant => {
    if (item.actual === 'positive' && item.predicted === 'positive') return 'TP';
    if (item.actual === 'negative' && item.predicted === 'negative') return 'TN';
    if (item.actual === 'negative' && item.predicted === 'positive') return 'FP';
    return 'FN'; // item.actual === 'positive' && item.predicted === 'negative'
  };

  const handleStartGame = (scenarioId?: string) => {
    sound.playClick();
    if (scenarioId) {
      setSelectedScenarioId(scenarioId);
    }
    setCaseIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLastFeedback(null);
    setShowHint(false);
    setMatrixCounts({ tp: 0, tn: 0, fp: 0, fn: 0 });
    setGameState('playing');
  };

  const handleSelectQuadrant = (chosen: MatrixQuadrant) => {
    if (!currentCase || lastFeedback !== null) return;

    const correctQuadrant = getCorrectQuadrant(currentCase);
    const isCorrect = chosen === correctQuadrant;

    // Update matrix counts
    setMatrixCounts((prev) => {
      const next = { ...prev };
      if (chosen === 'TP') next.tp += 1;
      else if (chosen === 'TN') next.tn += 1;
      else if (chosen === 'FP') next.fp += 1;
      else if (chosen === 'FN') next.fn += 1;
      return next;
    });

    if (isCorrect) {
      sound.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setScore((prev) => prev + 100 + newStreak * 20);

      if (newStreak % 3 === 0) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      sound.playError();
      setStreak(0);
    }

    setLastFeedback({
      isCorrect,
      chosen,
      correctQuadrant,
      explanation: isCorrect
        ? `¡Exacto! ${QUADRANT_EXPLANATIONS[correctQuadrant].name}: ${QUADRANT_EXPLANATIONS[correctQuadrant].rule}`
        : `¡Casi! Elegiste ${QUADRANT_EXPLANATIONS[chosen].name}, pero la respuesta correcta es ${QUADRANT_EXPLANATIONS[correctQuadrant].name}. ${currentCase.explanationIfWrong}`,
    });
  };

  const handleNextCase = () => {
    sound.playClick();
    setLastFeedback(null);
    setShowHint(false);

    if (caseIndex + 1 < scenario.cases.length) {
      setCaseIndex(caseIndex + 1);
    } else {
      setGameState('completed');
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const metrics = calculateMetrics(matrixCounts);

  // -------------------------------------------------------------
  // SCREEN 1: WELCOME & START SCREEN (HOW TO PLAY)
  // -------------------------------------------------------------
  if (gameState === 'welcome') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-2">
        {/* Hero Card */}
        <div className="p-6 sm:p-10 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-b from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ¡El Laboratorio del Inspector de IA!
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Aprende la Matriz de Confusión Jugando
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Tu trabajo es supervisar a una Inteligencia Artificial. ¿Acertó o se confundió? Clasifica los casos y construye la famosa <strong>Matriz de Confusión 2×2</strong>.
            </p>
          </div>

          {/* Big Start Button */}
          <div className="pt-2">
            <button
              onClick={() => handleStartGame(SCENARIOS[0].id)}
              className="px-8 sm:px-12 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all inline-flex items-center gap-3"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>¡EMPEZAR A JUGAR AHORA!</span>
            </button>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              👉 Nivel 1: Caza-Monstruos en el Armario (Fácil y divertido)
            </span>
          </div>

          {/* 3 Step Visual Guide: ¿Cómo se juega? */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <Compass className="w-4 h-4 text-indigo-500" />
              ¿Cómo se juega en 3 pasos simples?
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Mira la pantalla
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Llegará un caso (por ejemplo, una silueta oscura en el armario). Verás lo que <strong>predijo la IA</strong> y la <strong>realidad oculta</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Aplica la regla de oro
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  ¿La IA acertó? (<strong>Verdadero</strong> o <strong>Falso</strong>). ¿Y qué dijo que era? (<strong>Positivo</strong> = SÍ, <strong>Negativo</strong> = NO).
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center justify-center">
                  3
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Toca la opción correcta
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Elige entre <strong>VP</strong> (acierto sí), <strong>VN</strong> (acierto no), <strong>FP</strong> (falsa alarma) o <strong>FN</strong> (peligro oculto). ¡Gana puntos y racha!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Missions Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              O elige una misión directamente:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SCENARIOS.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => handleStartGame(s.id)}
                className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Nivel {idx + 1} · {s.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {s.subtitle}
                  </p>
                  <div className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span>Jugar esta misión</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: GAMEPLAY LOOP (INSPECTION & CLASSIFICATION)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setGameState('welcome');
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>{scenario.icon}</span>
            <span>{scenario.title}</span>
          </div>
        </div>

        {/* Stats and Restart */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <span>Racha: <strong className="text-slate-900 dark:text-white">{streak}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span>Puntos: <strong className="text-slate-900 dark:text-white">{score}</strong></span>
          </div>
          <button
            onClick={() => handleStartGame(selectedScenarioId)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Reiniciar esta misión"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {gameState === 'playing' && currentCase ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Inspection Area (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Guide Hint Banner */}
            <div className="p-3 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs text-indigo-950 dark:text-indigo-200">
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  <strong>Tu turno:</strong> Compara lo que dijo la IA con la Realidad y haz clic en el cuadrante correcto abajo.
                </span>
              </span>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="underline font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2 cursor-pointer"
              >
                {showHint ? 'Ocultar pista' : '¿Pista?'}
              </button>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <strong>💡 Recuerda la regla de las 2 palabras:</strong>
                <div>1. ¿La IA acertó? Si acertó es <em>Verdadero</em>; si erró es <em>Falso</em>.</div>
                <div>2. ¿Qué dijo la IA? Si dijo que SÍ había algo es <em>Positivo</em>; si dijo que NO es <em>Negativo</em>.</div>
              </div>
            )}

            {/* Case Card */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Caso #{caseIndex + 1} de {scenario.cases.length}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                  Confianza IA: {Math.round(currentCase.aiConfidence * 100)}%
                </span>
              </div>

              {/* Subject */}
              <div className="text-center py-2">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl shadow-inner border border-slate-200 dark:border-slate-700">
                  {currentCase.emoji}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {currentCase.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                  {currentCase.description}
                </p>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-indigo-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-indigo-500" />
                    Predicción de la IA
                  </span>
                  <div className="text-sm font-extrabold flex items-center justify-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                    <span>{currentCase.predicted === 'positive' ? scenario.positiveEmoji : scenario.negativeEmoji}</span>
                    <span>
                      {currentCase.predicted === 'positive'
                        ? scenario.positiveLabel
                        : scenario.negativeLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (La IA dijo: {currentCase.predicted === 'positive' ? '¡SÍ, DETECTADO!' : 'NO HAY NADA'})
                  </span>
                </div>

                <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Realidad Oculta
                  </span>
                  <div className="text-sm font-extrabold flex items-center justify-center gap-1.5 text-slate-800 dark:text-slate-100">
                    <span>{currentCase.actual === 'positive' ? scenario.positiveEmoji : scenario.negativeEmoji}</span>
                    <span>
                      {currentCase.actual === 'positive'
                        ? scenario.positiveLabel
                        : scenario.negativeLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (En verdad era: {currentCase.actual === 'positive' ? 'POSITIVO' : 'NEGATIVO'})
                  </span>
                </div>
              </div>

              {/* The 4 Quadrant Interactive Buttons */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                  👉 ¿Qué tipo de resultado es este? (Toca una opción):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: VP */}
                  <button
                    disabled={lastFeedback !== null}
                    onClick={() => handleSelectQuadrant('TP')}
                    className={`p-3.5 rounded-xl border-2 font-medium text-left transition-all cursor-pointer disabled:cursor-not-allowed
                      border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30
                      ${lastFeedback?.correctQuadrant === 'TP' ? 'ring-4 ring-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verdadero Positivo (VP)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-1">
                      ¡Acertó! Dijo que SÍ y de verdad era SÍ
                    </span>
                  </button>

                  {/* Option 2: FP */}
                  <button
                    disabled={lastFeedback !== null}
                    onClick={() => handleSelectQuadrant('FP')}
                    className={`p-3.5 rounded-xl border-2 font-medium text-left transition-all cursor-pointer disabled:cursor-not-allowed
                      border-amber-300 hover:border-amber-500 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/30
                      ${lastFeedback?.correctQuadrant === 'FP' ? 'ring-4 ring-amber-400 bg-amber-50 dark:bg-amber-950/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Falso Positivo (FP)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-1">
                      ¡Falsa Alarma! Dijo que SÍ, pero era NO
                    </span>
                  </button>

                  {/* Option 3: FN */}
                  <button
                    disabled={lastFeedback !== null}
                    onClick={() => handleSelectQuadrant('FN')}
                    className={`p-3.5 rounded-xl border-2 font-medium text-left transition-all cursor-pointer disabled:cursor-not-allowed
                      border-rose-300 hover:border-rose-500 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/30
                      ${lastFeedback?.correctQuadrant === 'FN' ? 'ring-4 ring-rose-400 bg-rose-50 dark:bg-rose-950/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Falso Negativo (FN)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-1">
                      ¡Peligro Oculto! Dijo que NO, pero era SÍ
                    </span>
                  </button>

                  {/* Option 4: VN */}
                  <button
                    disabled={lastFeedback !== null}
                    onClick={() => handleSelectQuadrant('TN')}
                    className={`p-3.5 rounded-xl border-2 font-medium text-left transition-all cursor-pointer disabled:cursor-not-allowed
                      border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30
                      ${lastFeedback?.correctQuadrant === 'TN' ? 'ring-4 ring-blue-400 bg-blue-50 dark:bg-blue-950/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Verdadero Negativo (VN)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-1">
                      ¡Acertó! Dijo que NO y de verdad era NO
                    </span>
                  </button>
                </div>
              </div>

              {/* Feedback Drawer */}
              {lastFeedback && (
                <div
                  className={`mt-4 p-4 rounded-xl border animate-in fade-in duration-200 ${
                    lastFeedback.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-sm font-bold block mb-1">
                        {lastFeedback.isCorrect ? '✨ ¡Correcto!' : '⚠️ ¡Revisa la explicación!'}
                      </span>
                      <p className="text-xs leading-relaxed">{lastFeedback.explanation}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextCase}
                      className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Siguiente Caso</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Confusion Matrix Mini Monitor (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  Tu Matriz en Vivo
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {matrixCounts.tp + matrixCounts.tn + matrixCounts.fp + matrixCounts.fn} clasificados
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mb-3">
                Cada caso que clasificas se suma automáticamente a uno de los 4 cuadrantes:
              </p>

              <MatrixHeatmap
                counts={matrixCounts}
                positiveLabel={scenario.positiveLabel}
                negativeLabel={scenario.negativeLabel}
                highlightQuadrant={lastFeedback?.correctQuadrant}
                compact
              />

              {/* Quick metrics preview */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Exactitud (Accuracy)</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                    {formatPercent(metrics.accuracy)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Precisión</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatPercent(metrics.precision)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mission Completed Report */
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-xl max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-3xl">
            🏆
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              ¡Misión Completada con Éxito!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Has clasificado todos los casos de <strong>{scenario.title}</strong> y construido su Matriz de Confusión completa.
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 max-w-md mx-auto text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Puntaje Final</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{score}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mejor Racha</span>
              <span className="text-xl font-black text-amber-500">{maxStreak} 🔥</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Exactitud</span>
              <span className="text-xl font-black text-emerald-600">{formatPercent(metrics.accuracy)}</span>
            </div>
          </div>

          {/* Full Resulting Matrix */}
          <div className="max-w-md mx-auto text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Matriz de Confusión Resultante
            </h4>
            <MatrixHeatmap
              counts={matrixCounts}
              positiveLabel={scenario.positiveLabel}
              negativeLabel={scenario.negativeLabel}
            />
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-xs">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200">
              <span className="block text-[10px] text-emerald-600">Precisión</span>
              <strong>{formatPercent(metrics.precision)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200">
              <span className="block text-[10px] text-rose-600">Recall</span>
              <strong>{formatPercent(metrics.recall)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200">
              <span className="block text-[10px] text-purple-600">F1-Score</span>
              <strong>{formatPercent(metrics.f1Score)}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleStartGame(selectedScenarioId)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Jugar de nuevo esta misión
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setGameState('welcome');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Elegir otra misión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
