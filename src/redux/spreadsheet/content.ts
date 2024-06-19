import { BaseContent, GetAvailableContent, GetContent } from 'src/redux/userInterface';
import { SpreadsheetState } from './spreadsheetSlice';

export const SPREADSHEET_CONTENT_TYPE = 'spreadsheet';

export interface SpreadsheetContent extends BaseContent {
  type: typeof SPREADSHEET_CONTENT_TYPE;
}

export const getSpreadsheetContent: GetContent<SpreadsheetState> = ({ contentId, state }) => {
  const sheet = state.sheets[contentId];
  return {
    type: SPREADSHEET_CONTENT_TYPE,
    contentId: sheet.id,
    label: sheet.label,
  };
};

export const getAvailableSpreadsheets: GetAvailableContent<SpreadsheetState> = ({ state }) => {
  return Object.keys(state.sheets).map((sheetId) => {
    return getSpreadsheetContent({ contentId: sheetId, state });
  });
};
