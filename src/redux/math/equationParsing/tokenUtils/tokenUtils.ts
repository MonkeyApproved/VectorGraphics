import { CompositionType, TokenType } from './tokenEnums';
import { Token } from './tokenTypes';

export function computesToValue({ token }: { token: Token }): boolean {
  return (
    [TokenType.Cell, TokenType.Variable, TokenType.Array, TokenType.Number, TokenType.CellRange].indexOf(token.type) !==
    -1
  );
}

export function valuePrevious({ previous }: { previous: Token }): boolean {
  if (previous.type === TokenType.Composition) {
    return [CompositionType.RightParenthesis, CompositionType.ArrayEnd].indexOf(previous.name) !== -1;
  }
  return computesToValue({ token: previous });
}

export function valueNext({ next }: { next: Token }): boolean {
  if (next.type === TokenType.Composition) {
    return [CompositionType.LeftParenthesis, CompositionType.ArrayStart].indexOf(next.name) !== -1;
  } else if (next.type === TokenType.Function) {
    return true;
  }
  return computesToValue({ token: next });
}

export function isValue({ token }: { token: Token }): boolean {
  return (
    token.type === TokenType.Cell ||
    token.type === TokenType.Variable ||
    token.type === TokenType.Array ||
    token.type === TokenType.Number ||
    token.type === TokenType.CellRange
  );
}
