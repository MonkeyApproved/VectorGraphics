import { SpreadsheetState } from './spreadsheetSlice';

export const SpreadsheetIdPrefix = 'spreadsheet';
export function getSpreadsheetId({ state }: { state: SpreadsheetState }): string {
  state.sheetCounter += 1;
  return `${SpreadsheetIdPrefix}${state.sheetCounter}`;
}
