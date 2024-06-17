import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { Spreadsheet } from './types';

export interface SpreadsheetState {
  managers: Spreadsheet[];
}

export const initialState: SpreadsheetState = {
  managers: [],
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
