import { RpnToken, Token } from './tokenTypes';

export interface Equation {
  input: string;
  tokens?: Token[];
  errorMessage?: string;
  rpn?: RpnToken[];
  result?: number | number[] | undefined;
}

export interface EquationDict {
  [id: string]: Equation;
}
