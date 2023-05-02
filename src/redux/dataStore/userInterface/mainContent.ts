import { SubContent, SubContentTypes } from './subContent';
import { VariableTable, getNewVariableTable } from './variableTable';

export type MainContentTypes = 'variables' | 'spreadsheet' | 'canvas' | 'data';

export const contentCounter: { [key in MainContentTypes | SubContentTypes]: number } = {
  variables: 0,
  spreadsheet: 0,
  canvas: 0,
  data: 0,
  svgElement: 0,
  color: 0,
  stroke: 0,
  font: 0,
  alignElements: 0,
  addElement: 0,
  transformations: 0,
};

export function getContentId({ type }: { type: MainContentTypes }): string {
  contentCounter[type] += 1;
  return `${type}${contentCounter[type]}`;
}

export interface MainContent {
  id: string;
  containerId: string | undefined;
  type: MainContentTypes;
  label: string;
}

export interface NewContentFunction {
  label: string;
  containerId?: string;
}

export interface DataExplorer extends MainContent {
  type: 'data';
  dataId?: string;
}

export function getNewDataExplorer({ label, containerId }: NewContentFunction): DataExplorer {
  return {
    id: getContentId({ type: 'variables' }),
    containerId: containerId,
    type: 'data',
    label: label,
  };
}

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

export interface SvgEditor extends MainContent {
  type: 'canvas';
  elementIds: string[];
  subContentDict: { [id: string]: SubContent | VariableTable | Spreadsheet };
}

export function getNewCanvas({ label, containerId }: NewContentFunction): SvgEditor {
  return {
    id: getContentId({ type: 'canvas' }),
    containerId: containerId,
    type: 'canvas',
    label: label,
    elementIds: [],
    subContentDict: {},
  };
}

export function getNewMainContent({
  label,
  containerId,
  type,
}: NewContentFunction & { type: MainContentTypes }): UiContent {
  switch (type) {
    case 'canvas':
      return getNewCanvas({ label, containerId });
    case 'variables':
      return getNewVariableTable({ label, containerId });
    case 'spreadsheet':
      return getNewSpreadsheet({ label, containerId });
    case 'data':
      return getNewDataExplorer({ label, containerId });
  }
  throw new Error(`Unknown content type ${type}`);
}

export type UiContent = VariableTable | Spreadsheet | SvgEditor | DataExplorer;
