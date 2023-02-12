import { CellDetails } from 'redux/dataStore/equations/tokenTypes';

export function capitalizeFirstLetter({ string }: { string: string }) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function concatCamelCase({ stringList }: { stringList: string[] }) {
  const first = stringList[0].toLowerCase();
  const others = stringList.slice(1).map((string) => capitalizeFirstLetter({ string }));
  return first.concat(...others);
}

export function getSpreadsheetColumnLabel({ index }: { index: number }): string {
  if (index > 25) {
    const str1 = String.fromCharCode((index % 26) + 65);
    const str2 = getSpreadsheetColumnLabel({ index: Math.floor(index / 26) - 1 });
    return str2 + str1;
  } else {
    return String.fromCharCode(index + 65);
  }
}

export function getSpreadsheetColumnIndex({ label }: { label: string }) {
  return label;
}

export function getSpreadsheetRowLabel({ index }: { index: number }): string {
  return `${index + 1}`;
}

export function stringToColumnIndex({ columnString }: { columnString: string }): number {
  let column = 0;
  for (let i = 0; i <= columnString.length - 1; i++) {
    const charCode = columnString.charCodeAt(i);
    column += (charCode - 64) * Math.pow(26, i);
  }
  return column - 1;
}

export function stringToCellDetails({ cellName }: { cellName: string }): CellDetails {
  const match = cellName.match(/^(?<column>[A-Z]+)(?<row>[0-9]+)$/);

  const columnString = (match?.groups && match.groups['column']) || '';
  const rowString = (match?.groups && match.groups['row']) || '';
  return {
    columnString,
    rowString,
    columnIndex: stringToColumnIndex({ columnString }),
    rowIndex: Number(rowString) - 1,
  };
}
