export type GameMode = 'arcade' | 'sandbox' | 'dilemmas' | 'theory' | 'quiz';

export type RealityClass = 'positive' | 'negative';
export type PredictionClass = 'positive' | 'negative';

export type MatrixQuadrant = 'TP' | 'TN' | 'FP' | 'FN';

export interface GameCase {
  id: string;
  name: string;
  description: string;
  emoji: string;
  visualHint?: string;
  actual: RealityClass; // Ground truth
  predicted: PredictionClass; // What AI decided
  aiConfidence: number; // e.g. 0.85
  explanationIfWrong: string;
}

export interface ScenarioTheme {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: 'Fácil' | 'Medio' | 'Avanzado' | 'Experto';
  positiveLabel: string; // e.g. "¡Es Monstruo!"
  negativeLabel: string; // e.g. "Es un Peluche"
  positiveEmoji: string;
  negativeEmoji: string;
  cases: GameCase[];
  contextStory: string;
  highStakesWarning: string;
}

export interface MatrixCounts {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export interface CalculatedMetrics {
  total: number;
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1Score: number;
}

export interface SandboxPoint {
  id: number;
  actual: RealityClass;
  score: number; // predicted probability [0, 1]
  label: string;
}

export interface DilemmaCase {
  id: string;
  title: string;
  category: string;
  icon: string;
  scenario: string;
  positiveCase: string;
  negativeCase: string;
  falsePositiveConsequence: string;
  falseNegativeConsequence: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  keyTakeaway: string;
  targetMetric: 'precision' | 'recall' | 'balanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  context?: string;
  matrixData?: MatrixCounts;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptTag: 'Concepto Básico' | 'Falsos Positivos' | 'Falsos Negativos' | 'Precisión vs Recall' | 'Métricas';
}
