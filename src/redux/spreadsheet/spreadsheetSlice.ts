import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { getEmptySpreadsheet, Spreadsheet } from './spreadsheet';

export interface SpreadsheetState {
  sheetCounter: number;
  sheets: { [key: string]: Spreadsheet };
}

export const initialSpreadsheetState: SpreadsheetState = {
  sheetCounter: 1,
  sheets: {
    sheet1: {
      id: 'sheet1',
      ...getEmptySpreadsheet({ label: 'Sheet1' }),
    },
  },
};

export type SpreadsheetSliceReducer<PayloadType> = (
  state: SpreadsheetState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState: initialSpreadsheetState,
  reducers: { ...reducers },
});
export default spreadsheetSlice;
export const { addSpreadsheet, removeSpreadsheet } = spreadsheetSlice.actions;
