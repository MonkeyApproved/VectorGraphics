import { getSpreadsheetId } from './id';
import { getEmptySpreadsheet } from './spreadsheet';
import { SpreadsheetSliceReducer } from './spreadsheetSlice';

const addSpreadsheet: SpreadsheetSliceReducer<{ label?: string; nRows?: number; nColumns?: number }> = (
  state,
  { payload },
) => {
  const sheetId = getSpreadsheetId({ state });
  state.sheets[sheetId] = { ...getEmptySpreadsheet(payload), id: sheetId };
};

const removeSpreadsheet: SpreadsheetSliceReducer<{ sheetId: string }> = (state, { payload }) => {
  // get the spreadsheet to remove
  const sheet = state.sheets[payload.sheetId];
  if (!sheet) {
    throw new Error(`Spreadsheet with id ${payload.sheetId} not found`);
  }

  // remove the canvas
  delete state.sheets[payload.sheetId];
};

export const reducers = { addSpreadsheet, removeSpreadsheet };
