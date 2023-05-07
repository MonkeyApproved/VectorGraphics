import { MainContent, NewContentFunction, getContentId } from './content';

export interface Spreadsheet extends MainContent {
  type: 'spreadsheet';
  nColumns: number;
  nRows: number;
}

export function getNewSpreadsheet({ label, containerId }: NewContentFunction): Spreadsheet {
  return {
    id: getContentId({ type: 'spreadsheet' }),
    containerId: containerId,
    type: 'spreadsheet',
    label: label,
    nColumns: 5,
    nRows: 5,
  };
}
