import { MathState } from '../mathSlice';
import { getExistingEquation } from './getEquation';
import { Context } from './types';

export function getNumberFromEquation({ context, state }: { context: Context; state: MathState }): number {
  const equation = getExistingEquation({ context, state });
  return equation?.lastValidNumber || NaN;
}
