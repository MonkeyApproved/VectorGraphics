import { DataContext, SpreadsheetContext, SvgContext, VariableContext } from 'src/redux/context';
import { UndefinedContext } from './equationParsing/unknownReference';

export interface BaseContext {
  type: string;
  namespace: string;
  name: string;
}

export type Context = UndefinedContext | VariableContext | SvgContext | SpreadsheetContext | DataContext;
