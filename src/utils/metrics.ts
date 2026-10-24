import { CalculatedMetrics, MatrixCounts } from '../types';

export function calculateMetrics(counts: MatrixCounts): CalculatedMetrics {
  const { tp, tn, fp, fn } = counts;
  const total = tp + tn + fp + fn;

  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  
  const f1Score =
    precision + recall > 0 ? (2 * (precision * recall)) / (precision + recall) : 0;

  return {
    total,
    accuracy,
    precision,
    recall,
    specificity,
    f1Score,
  };
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0.0%';
  return `${(value * 100).toFixed(1)}%`;
}
