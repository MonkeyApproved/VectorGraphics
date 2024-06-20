export interface SpreadsheetColumn {
  id: string;
  label?: string;
  width: number;
}

export function getNewColumn({
  index,
  label,
  width = 150,
}: {
  index: number;
  label?: string;
  width?: number;
}): SpreadsheetColumn {
  return { id: getSpreadsheetColumnId({ index }), label, width };
}

export interface SpreadsheetRow {
  id: string;
  label?: string;
  height: number;
}

export function getNewRow({
  index,
  label,
  height = 30,
}: {
  index: number;
  label?: string;
  height?: number;
}): SpreadsheetRow {
  return { id: getSpreadsheetRowId({ index }), label, height };
}

export interface Spreadsheet {
  id: string;
  label?: string;
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
}

export function getEmptySpreadsheet({
  label,
  nRows = 20,
  nColumns = 10,
}: {
  label?: string;
  nRows?: number;
  nColumns?: number;
}): Omit<Spreadsheet, 'id'> {
  return {
    label,
    columns: [...Array(nColumns).keys()].map((index) => getNewColumn({ index })),
    rows: [...Array(nRows).keys()].map((index) => getNewRow({ index })),
  };
}

export function getSpreadsheetColumnId({ index }: { index: number }): string {
  if (index > 25) {
    const str1 = String.fromCharCode((index % 26) + 65);
    const str2 = getSpreadsheetColumnId({ index: Math.floor(index / 26) - 1 });
    return str2 + str1;
  } else {
    return String.fromCharCode(index + 65);
  }
}

export function getSpreadsheetRowId({ index }: { index: number }): string {
  return `${index + 1}`;
}
