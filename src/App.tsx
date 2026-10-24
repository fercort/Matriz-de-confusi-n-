/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode } from './types';
import { Header } from './components/Header';
import { ArcadeGame } from './components/ArcadeGame';
import { ThresholdSandbox } from './components/ThresholdSandbox';
import { DilemmaDecider } from './components/DilemmaDecider';
import { TheoryGuide } from './components/TheoryGuide';
import { QuizCertification } from './components/QuizCertification';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Sparkles, Brain, CheckCircle2, Heart } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('arcade');
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      {/* Quick Tutorial Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        onStartPlaying={() => {
          setIsHowToPlayOpen(false);
          setCurrentMode('arcade');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'arcade' && <ArcadeGame />}
        {currentMode === 'sandbox' && <ThresholdSandbox />}
        {currentMode === 'dilemmas' && <DilemmaDecider />}
        {currentMode === 'theory' && <TheoryGuide />}
        {currentMode === 'quiz' && <QuizCertification />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">MatrizLab</span>
            <span>·</span>
            <span>Juego Educativo de Ciencia de Datos & Aprendizaje Automático</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMode('theory')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
            >
              Fórmulas y Mnemotécnicas
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentMode('quiz')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
            >
              Obtener Certificado
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
