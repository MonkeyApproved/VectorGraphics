import { SpreadsheetContent } from 'src/redux/spreadsheet/content';
import { CanvasContent } from 'src/redux/canvas';
import { VariableManagerContent } from 'src/redux/variableManager';
import { DataExplorerContent } from 'src/redux/dataExplorer';

export interface BaseContent {
  id: string;
  type: string;
}

export type Content = SpreadsheetContent | CanvasContent | VariableManagerContent | DataExplorerContent;
