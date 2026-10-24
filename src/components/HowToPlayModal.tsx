import React from 'react';
import { X, Play, Brain, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlaying: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartPlaying,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-base font-black">
              ?
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                ¿Cómo se juega a MatrizLab?
              </h3>
              <p className="text-xs text-slate-500">Guía rápida de 30 segundos</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The 3 Steps */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-300 block">
              1. Tu Misión
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Una Inteligencia Artificial analiza casos (monstruos, correos spam, asteroides o virus) e intenta predecir qué son. Tu trabajo es <strong>calificar el acierto o error de la IA</strong> en la Matriz de Confusión.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-black uppercase text-slate-500 block">
              2. Compara dos datos clave en cada turno
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lo que dijo la IA</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Predicción</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lo que era de verdad</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Realidad</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-black uppercase text-slate-500 block">
              3. Toca uno de los 4 botones:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>VP:</strong> Dijo que SÍ y era SÍ (¡Acierto!)</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>FP:</strong> Dijo que SÍ pero era NO (Falsa Alarma)</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span><strong>FN:</strong> Dijo que NO pero era SÍ (Peligro ignorado)</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>VN:</strong> Dijo que NO y era NO (¡Acierto!)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
              onStartPlaying();
            }}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>¡Entendido, quiero jugar!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
