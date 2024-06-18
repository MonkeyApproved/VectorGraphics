import { UndefinedContext } from './equationParsing/unknownReference';
import { SvgContext } from 'src/redux/canvas';
import { VariableContext } from 'src/redux/variableManager';
import { SpreadsheetContext } from '../spreadsheet';
import { DataContext } from '../dataExplorer';

export interface BaseContext {
  type: string;
  namespace: string;
  name: string;
}

export type Context = UndefinedContext | VariableContext | SvgContext | SpreadsheetContext | DataContext;
