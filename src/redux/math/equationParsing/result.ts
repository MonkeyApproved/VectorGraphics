import { Equation, Result } from './types';
import { MathState } from '../mathSlice';
import { getExistingEquation } from './getEquation';
import { Context } from '../context';

export function getNumberFromEquation({ context, state }: { context: Context; state: MathState }): number {
  const equation = getExistingEquation({ context, state });
  return equation?.lastValidNumber || NaN;
}

export function setEquationResult({ equation, result }: { equation: Equation; result: Result }) {
  equation.result = result;
  if (typeof result === 'number' && !isNaN(result)) {
    equation.lastValidNumber = result;
  }
}

export function directlyParseResultFromInput({ input }: { input: string | number }): number | undefined {
  // check if input is already a number
  if (typeof input === 'number') {
    return input;
  }

  // check if input can be parsed to a number
  const match = input.match(/^[-+]?\d*\.?\d+$/);
  if (match) {
    return parseFloat(input);
  }

  // input is not a simple number
  return undefined;
}
