import React, { useState } from 'react';
import { GameMode } from '../types';
import { sound } from '../utils/sound';
import {
  Gamepad2,
  Sliders,
  Scale,
  BookOpen,
  Award,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenHowToPlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenHowToPlay,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playSuccess();
    }
  };

  const navItems: { id: GameMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'arcade', label: 'Misiones Arcade', icon: Gamepad2 },
    { id: 'sandbox', label: 'Simulador de Umbral', icon: Sliders },
    { id: 'dilemmas', label: 'Dilemas del Mundo Real', icon: Scale },
    { id: 'theory', label: 'Academia & Fórmulas', icon: BookOpen },
    { id: 'quiz', label: 'Quiz & Certificado', icon: Award },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-xs">
              <span className="font-mono font-black text-sm">2×2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  MatrizLab
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hidden sm:inline">
                  Ciencia de Datos
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Aprende la Matriz de Confusión jugando
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectMode(item.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action buttons: How to play & Sound Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenHowToPlay();
              }}
              className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>¿Cómo se juega?</span>
            </button>

            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                isMuted
                  ? 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                  : 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
              }`}
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Mute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Sonido</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between gap-1 py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectMode(item.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
