import { Dependencies } from './dependencies';
import { RpnToken, Token } from './tokenTypes';

export interface Equation {
  id: string;
  input?: string;
  dependencies: Dependencies;
  tokens?: Token[];
  errorMessage?: string;
  rpn?: RpnToken[];
  result?: number | number[] | undefined;
}

export function getNewEquation({ id, input }: { id: string; input?: string }): Equation {
  return { id, input, dependencies: { children: [], parents: [] } };
}

export interface EquationDict {
  [id: string]: Equation;
}

export function setEquationError({ equation, errorMessage }: { equation: Equation; errorMessage: string }) {
  equation.errorMessage = errorMessage;
  equation.result = undefined;
}
