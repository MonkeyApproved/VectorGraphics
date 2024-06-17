import { RpnToken, Token } from './tokenUtils/tokenTypes';
import { Context } from '../context';

export type Result = number | number[] | undefined;

export interface Dependencies {
  children: Context[];
  parents: Context[];
}

export interface Equation {
  context: Context;
  version: number;
  input?: string;
  dependencies: Dependencies;
  tokens?: Token[];
  errorMessage?: string;
  rpn?: RpnToken[];
  result?: Result;
  lastValidNumber?: number;
}
