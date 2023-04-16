import { range } from 'generalHelpers/numberHelper';
import { getSpreadsheetColumnLabel, getSpreadsheetRowLabel } from 'generalHelpers/stringHelper';
import { CompositionType, TokenType } from './tokenEnums';
import { CellToken, Token } from './tokenTypes';

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

export function cellRangeToCellList({ from, to }: { from: CellToken; to: CellToken }): string[] | undefined {
  if (from.details.columnIndex === to.details.columnIndex) {
    // cell range is a column of cells
    const columnLabel = getSpreadsheetColumnLabel({ index: from.details.columnIndex });
    return range({
      n: to.details.rowIndex - from.details.rowIndex + 1,
      start: from.details.rowIndex,
    }).map((index) => `${columnLabel}${getSpreadsheetRowLabel({ index })}`);
  } else if (from.details.rowIndex === to.details.rowIndex) {
    // cell range is a row of cells
    const rowLabel = getSpreadsheetRowLabel({ index: from.details.rowIndex });
    return range({
      n: to.details.columnIndex - from.details.columnIndex + 1,
      start: from.details.columnIndex,
    }).map((index) => `${getSpreadsheetColumnLabel({ index })}${rowLabel}`);
  }
  return undefined;
}
