import { DataState } from '../dataSlice';
import { Dependencies } from './dependencies';
import { RpnToken, Token } from './tokenTypes';

export type Result = number | number[] | undefined;

export interface Equation {
  id: string;
  input?: string;
  dependencies: Dependencies;
  tokens?: Token[];
  errorMessage?: string;
  rpn?: RpnToken[];
  result?: Result;
  lastValidNumber?: number;
}

export interface EquationDict {
  [id: string]: Equation;
}

export function getNewEquation({ id, input }: { id: string; input?: string }): Equation {
  return { id, input, dependencies: { children: [], parents: [] } };
}

export function setEquationError({ equation, errorMessage }: { equation: Equation; errorMessage: string }) {
  equation.errorMessage = errorMessage;
  equation.result = undefined;
  return equation;
}

export function setEquationResult({ equation, result }: { equation: Equation; result: Result }) {
  equation.result = result;
  if (typeof result === 'number' && !isNaN(result)) {
    equation.lastValidNumber = result;
  }
}

export function getNumberFromEquation({ equationId, state }: { equationId: string; state: DataState }): number {
  const equation = state.equations[equationId];
  return equation?.lastValidNumber || NaN;
}
