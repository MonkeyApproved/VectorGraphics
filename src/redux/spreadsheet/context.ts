import { BaseContext } from 'src/redux/context';

export const SPREADSHEET_CONTEXT_TYPE = 'spreadsheet';

export interface SpreadsheetContext extends BaseContext {
  type: typeof SPREADSHEET_CONTEXT_TYPE;
}
