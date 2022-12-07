import { CompositionType, TokenType } from './tokenEnums';
import { Token } from './tokenTypes';

export function computesToValue(token: Token): boolean {
  return (
    [
      TokenType.Cell,
      TokenType.Variable,
      TokenType.Array,
      TokenType.Number,
      TokenType.Function,
      TokenType.CellRange,
    ].indexOf(token.type) !== -1
  );
}

export function valueNext(next: Token): boolean {
  if (next.type === TokenType.Composition) {
    return [CompositionType.LeftParenthesis, CompositionType.ArrayStart].indexOf(next.name) !== -1;
  }
  return (
    [
      TokenType.Cell,
      TokenType.Variable,
      TokenType.Array,
      TokenType.Number,
      TokenType.Function,
      TokenType.CellRange,
    ].indexOf(next.type) !== -1
  );
}

export function isValue(token: Token): boolean {
  return (
    token.type === TokenType.Cell ||
    token.type === TokenType.Variable ||
    token.type === TokenType.Array ||
    token.type === TokenType.Number ||
    token.type === TokenType.CellRange
  );
}
