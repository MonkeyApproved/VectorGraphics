import { BaseContent } from 'src/redux/userInterface';

export const SPREADSHEET_CONTENT_TYPE = 'spreadsheet';

export interface SpreadsheetContent extends BaseContent {
  type: typeof SPREADSHEET_CONTENT_TYPE;
}
