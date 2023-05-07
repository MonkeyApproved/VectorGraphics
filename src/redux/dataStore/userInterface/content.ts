import { DataExplorer, getNewDataExplorer } from './dataExplorer';
import { Spreadsheet, getNewSpreadsheet } from './spreadsheet';
import { SvgEditor, getNewSvgEditor } from './svgEditor';
import { VariableTable, getNewVariableTable } from './variableTable';

export type MainContentTypes = 'variables' | 'spreadsheet' | 'canvas' | 'data';

export type SubContentTypes =
  | 'svgElement'
  | 'color'
  | 'stroke'
  | 'font'
  | 'alignElements'
  | 'addElement'
  | 'transformations';

export type AnyContentTypes = MainContentTypes | SubContentTypes;

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

export interface SubContent {
  id: string;
  containerId: string;
  type: SubContentTypes;
}

export type AnyContent = VariableTable | Spreadsheet | SvgEditor | DataExplorer;

export interface NewContentFunction {
  label: string;
  containerId?: string;
}

export function getNewContent({
  label,
  containerId,
  type,
}: NewContentFunction & { type: MainContentTypes }): AnyContent {
  switch (type) {
    case 'canvas':
      return getNewSvgEditor({ label, containerId });
    case 'variables':
      return getNewVariableTable({ label, containerId });
    case 'spreadsheet':
      return getNewSpreadsheet({ label, containerId });
    case 'data':
      return getNewDataExplorer({ label, containerId });
  }
  throw new Error(`Unknown content type ${type}`);
}
