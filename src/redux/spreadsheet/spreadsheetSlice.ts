import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { Spreadsheet } from './types';

export interface SpreadsheetState {
  sheets: { [key: string]: Spreadsheet };
}

export const initialState: SpreadsheetState = {
  sheets: {
    sheet1: {
      id: 'sheet1',
      label: 'Sheet 1',
      columns: [
        { id: 'column0', label: 'A', width: 100 },
        { id: 'column1', label: 'B', width: 100 },
        { id: 'column2', label: 'C', width: 100 },
      ],
      rows: [
        { id: 'row0', label: '1', height: 30 },
        { id: 'row1', label: '2', height: 30 },
        { id: 'row2', label: '3', height: 30 },
      ],
    },
  },
};

export type SpreadsheetSliceReducer<PayloadType> = (
  state: SpreadsheetState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: { ...reducers },
});
export default spreadsheetSlice;
export const {} = spreadsheetSlice.actions;
