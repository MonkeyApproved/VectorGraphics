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

export type EquationResultType = 'number' | 'color';

export function getRandomId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');
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

export function getEquationResultAsNumber({
  equationId,
  equationDict,
}: {
  equationId: string;
  equationDict: EquationDict;
}): number | undefined {
  const result = equationDict[equationId].result;
  if (result === undefined || typeof result === 'number') {
    return result;
  }
  return undefined;
}
