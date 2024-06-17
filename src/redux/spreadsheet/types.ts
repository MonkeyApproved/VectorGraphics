export interface SpreadsheetColumn {
  id: string;
  label: string;
  width: number;
}

export interface SpreadsheetRow {
  id: string;
  label: string;
  height: number;
}

export interface Spreadsheet {
  id: string;
  label: string;
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
}
