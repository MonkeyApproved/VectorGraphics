import { getFunction, MathFunction } from '../functionUtils';
import { associativity, operators, precedence, CompositionString, TokenType, nArgsNot2 } from './tokenEnums';

import {
  OperatorToken,
  CompositionToken,
  NumberToken,
  FunctionToken,
  VariableToken,
  CellToken,
  UnknownToken,
  StartToken,
  EndToken,
} from './tokenTypes';
import { MathState } from '../../slice';
import { internalFunctions } from '../functionUtils/internalFunctions';

export function getOperatorToken(symbol: string, offset: number) {
  const name = operators[symbol];
  const token: OperatorToken = {
    type: TokenType.Operator,
    position: { offset, length: 1 },
    symbol,
    name,
    nArgs: nArgsNot2[name] || 2,
    precedence: precedence[name],
    associativity: associativity[name],
    definition: internalFunctions[name],
    value: undefined,
  };
  return token;
}

export function getCompositionToken(symbol: string, offset: number) {
  const token: CompositionToken = {
    type: TokenType.Composition,
    position: { offset, length: 1 },
    name: CompositionString[symbol],
    symbol,
  };
  return token;
}

export function getNumberToken(number: string | number, offset: number) {
  const token: NumberToken = {
    type: TokenType.Number,
    position: { offset, length: `${number}`.length },
    value: Number(number),
    symbol: String(number),
  };
  return token;
}

export function getFunctionToken(name: string, offset: number, definition: MathFunction) {
  const token: FunctionToken = {
    type: TokenType.Function,
    position: { offset, length: name.length },
    definition: definition,
    symbol: name,
    nArgs: 1, // if more arguments are passed, this will be increased in fixTokens.handleComma
    value: undefined,
  };
  return token;
}

export function getVariableToken(name: string, offset: number) {
  const token: VariableToken = {
    type: TokenType.Variable,
    position: { offset, length: name.length },
    name,
    value: undefined,
    symbol: name,
  };
  return token;
}

export function getCellToken(name: string, row: number, column: number, offset: number) {
  const token: CellToken = {
    type: TokenType.Cell,
    position: { offset, length: name.length },
    name,
    value: undefined,
    symbol: name,
  };
  return token;
}

export function getStringToken(name: string, offset: number, state: MathState) {
  // check if string is a valid function name
  const functionDefinition = getFunction({ name, state });
  if (functionDefinition) {
    return getFunctionToken(name, offset, functionDefinition);
  }

  // if string is neither a function nor a cell, it will be interpreted as a variable
  return getVariableToken(name, offset);
}

export function getUnknownToken(match: string, offset: number) {
  const token: UnknownToken = {
    type: TokenType.Unknown,
    position: { offset, length: match.length },
    name: match,
    symbol: match,
  };
  return token;
}

export function getStartToken(): StartToken {
  return { type: TokenType.Start, position: { offset: 0, length: 0 }, symbol: '' };
}

export function getEndToken(offset: number): EndToken {
  return { type: TokenType.End, position: { offset, length: 0 }, symbol: '' };
}
