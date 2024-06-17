import { Equation, Result } from './types';

export function setEquationResult({ equation, result }: { equation: Equation; result: Result }) {
  equation.result = result;
  if (typeof result === 'number' && !isNaN(result)) {
    equation.lastValidNumber = result;
  }
}
