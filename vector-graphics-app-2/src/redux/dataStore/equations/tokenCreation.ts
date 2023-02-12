import { stringToCellDetails } from 'generalHelpers/stringHelper';
import { getMathFunctionDetails, isValidFunctionName } from './mathFunctions';
import { associativity, operators, precedence, CompositionString, TokenType } from './tokenEnums';

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
  CellRangeToken,
} from './tokenTypes';
import { cellRangeToCellList } from './tokenUtils';

export function getOperatorToken(symbol: string, offset: number) {
  const name = operators[symbol];
  const token: OperatorToken = {
    type: TokenType.Operator,
    position: { offset, length: 1 },
    symbol,
    name,
    precedence: precedence[name],
    associativity: associativity[name],
    nArgs: 2,
    minArgs: 2,
    maxArgs: 2,
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

export function getFunctionToken(name: string, offset: number) {
  const mathFunction = getMathFunctionDetails({ name });
  const token: FunctionToken = {
    type: TokenType.Function,
    position: { offset, length: name.length },
    name,
    nArgs: 1,
    minArgs: mathFunction.minArgs,
    maxArgs: mathFunction.maxArgs,
    symbol: name,
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
    valid: false,
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
    details: stringToCellDetails({ cellName: name }),
    symbol: name,
  };
  return token;
}

export function getCellRangeToken(from: CellToken, to: CellToken) {
  const offset = from.position.offset;
  const length = to.position.offset + to.position.length - offset;
  const token: CellRangeToken = {
    type: TokenType.CellRange,
    position: { offset, length },
    from,
    to,
    cellList: cellRangeToCellList({ from, to }),
    value: undefined,
    symbol: `${from.symbol}:${to.symbol}`,
  };
  return token;
}

export function getStringToken(name: string, offset: number) {
  // check if string is a valid function name
  if (isValidFunctionName({ name })) {
    return getFunctionToken(name, offset);
  }

  // check the variable name is a spreadsheet cell (e.g. A1)
  const cell = name.match(/^([A-Z]+)([0-9]+)$/);
  if (cell !== null) {
    return getCellToken(name, Number(cell[1]), Number(cell[2]), offset);
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
