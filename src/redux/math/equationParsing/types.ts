import { RpnToken, Token } from './tokenUtils/tokenTypes';
import { SvgContext } from 'src/redux/dataStore/svg/context';
import { UndefinedContext } from './unknownReference';
import { VariableContext } from 'src/redux/variables/context';

export interface BaseContext {
  type: string;
  namespace: string;
  name: string;
}

export type Context = UndefinedContext | VariableContext | SvgContext;

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
