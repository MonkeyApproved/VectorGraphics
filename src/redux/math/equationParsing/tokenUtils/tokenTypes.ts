import { InternalFunction, MathFunction } from '../functionUtils';
import { asso, CompositionType, TokenType } from './tokenEnums';

export interface StringPosition {
  offset: number;
  length: number;
}

export interface BaseToken {
  type: TokenType;
  position: StringPosition;
  symbol: string;
  error?: string;
  warning?: string;
}

/***********************************************/
/***** Different token types for equations *****/
/***********************************************/

export interface StartToken extends BaseToken {
  type: TokenType.Start;
}

export interface EndToken extends BaseToken {
  type: TokenType.End;
}

export interface NumberToken extends BaseToken {
  type: TokenType.Number;
  value: number;
}

export interface ArrayToken extends BaseToken {
  type: TokenType.Array;
  value: number[];
}

export interface OperatorToken extends BaseToken {
  type: TokenType.Operator;
  precedence: number;
  associativity: asso;
  name: string;
  nArgs: number;
  definition: InternalFunction;
  value: number | number[] | undefined;
}

export interface CompositionToken extends BaseToken {
  type: TokenType.Composition;
  name: CompositionType;
}

export interface VariableToken extends BaseToken {
  type: TokenType.Variable;
  name: string;
  value: number[] | number | undefined; // will be inserted before computing the result
}

export interface CellDetails {
  columnString: string;
  rowString: string;
  columnIndex: number;
  rowIndex: number;
}

export interface CellToken extends BaseToken {
  type: TokenType.Cell;
  name: string;
  value: number[] | number | undefined;
}

export interface CellRangeToken extends BaseToken {
  type: TokenType.CellRange;
  from: CellToken;
  to: CellToken;
  cellList?: string[];
  value: number[] | undefined;
}

export interface FunctionToken extends BaseToken {
  type: TokenType.Function;
  definition: MathFunction;
  nArgs: number;
  value: number | number[] | undefined;
}

export interface UnknownToken extends BaseToken {
  type: TokenType.Unknown;
  name: string;
}

export type Token =
  | NumberToken
  | OperatorToken
  | CompositionToken
  | VariableToken
  | FunctionToken
  | CellToken
  | CellRangeToken
  | UnknownToken
  | ArrayToken
  | StartToken
  | EndToken;

export type SyntaxToken = OperatorToken | CompositionToken | FunctionToken;

export type ValueToken = NumberToken | VariableToken | CellToken | CellRangeToken | ArrayToken;

export type RpnToken =
  | OperatorToken
  | FunctionToken
  | VariableToken
  | ArrayToken
  | NumberToken
  | CellRangeToken
  | CellToken;
