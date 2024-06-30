import { createSelector } from '@reduxjs/toolkit';
import { Spreadsheet } from './spreadsheet';
import { RootState } from 'src/redux/store';

const getSpreadsheetDict = (state: RootState) => state.spreadsheet.sheets;

export const getSpreadsheet = createSelector(
  [getSpreadsheetDict, (state: RootState, sheetId: string): string => sheetId],
  (spreadsheetDict, sheetId): Spreadsheet => spreadsheetDict[sheetId],
);
