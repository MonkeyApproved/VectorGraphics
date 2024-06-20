import { Spreadsheet } from './spreadsheet';
import { RootState } from 'src/redux/store';

export const getSpreadsheet =
  ({ sheetId }: { sheetId: string }) =>
  (state: RootState): Spreadsheet =>
    state.spreadsheet.sheets[sheetId];
