import {
  SPREADSHEET_CONTENT_TYPE,
  SpreadsheetContent,
  getAvailableSpreadsheets,
  getSpreadsheetContent,
} from 'src/redux/spreadsheet/content';
import { CANVAS_CONTENT_TYPE, CanvasContent, getAvailableCanvases, getCanvasContent } from 'src/redux/canvas/content';
import {
  VARIABLE_MANAGER_CONTENT_TYPE,
  VariableManagerContent,
  getAvailableVariableManagers,
  getVariableManagerContent,
} from 'src/redux/variableManager/content';
import {
  DATA_EXPLORER_CONTENT_TYPE,
  DataExplorerContent,
  getAvailableDataExplorers,
  getDataExplorerContent,
} from 'src/redux/dataExplorer/content';
import { TabPosition } from './types';
import { RootState } from '../store';

export interface BaseContent {
  tabId: string;
  type: string;
  contentId: string;
  position: TabPosition;
}

export interface AvailableContent {
  type: string;
  contentId: string;
  label?: string;
}

export type ContentType =
  | typeof VARIABLE_MANAGER_CONTENT_TYPE
  | typeof CANVAS_CONTENT_TYPE
  | typeof SPREADSHEET_CONTENT_TYPE
  | typeof DATA_EXPLORER_CONTENT_TYPE;

export type Content = SpreadsheetContent | CanvasContent | VariableManagerContent | DataExplorerContent;
export type ContentWithLabel = Content & AvailableContent;

export type GetAvailableContent<Slice> = ({ state }: { state: Slice }) => AvailableContent[];

export type GetContent<Slice> = ({ contentId, state }: { contentId: string; state: Slice }) => AvailableContent;

export type AllAvailableContent = Record<ContentType, AvailableContent[]>;

export function getAllAvailableContent({ state }: { state: RootState }): AllAvailableContent {
  const availableContent: AllAvailableContent = {
    variableManager: getAvailableVariableManagers({ state: state.variableManager }),
    canvas: getAvailableCanvases({ state: state.canvas }),
    spreadsheet: getAvailableSpreadsheets({ state: state.spreadsheet }),
    dataExplorer: getAvailableDataExplorers({ state: state.dataExplorer }),
  };
  return availableContent;
}

export function getAvailableContent({
  contentId,
  type,
  state,
}: {
  contentId: string;
  type: ContentType;
  state: RootState;
}): AvailableContent {
  switch (type) {
    case VARIABLE_MANAGER_CONTENT_TYPE:
      return getVariableManagerContent({ contentId, state: state.variableManager });
    case CANVAS_CONTENT_TYPE:
      return getCanvasContent({ contentId, state: state.canvas });
    case SPREADSHEET_CONTENT_TYPE:
      return getSpreadsheetContent({ contentId, state: state.spreadsheet });
    case DATA_EXPLORER_CONTENT_TYPE:
      return getDataExplorerContent({ contentId, state: state.dataExplorer });
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}
