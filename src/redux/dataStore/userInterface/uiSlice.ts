import { SvgEditor, UiContent, getNewCanvas } from './mainContent';
import { VariableTable, getNewVariableTable } from './variableTable';

export interface ContentDict {
  [id: string]: UiContent;
}

export interface UiState {
  allContent: ContentDict;
  tabContent: string[];
  selectedTabId?: string;
}

const allContent: ContentDict = {};
const tabContent: string[] = [];

const canvas: SvgEditor = getNewCanvas({ label: 'Canvas', containerId: 'tabs' });
allContent[canvas.id] = canvas;
tabContent.push(canvas.id);

const variables: VariableTable = getNewVariableTable({ label: 'Variables', containerId: 'tabs' });
allContent[variables.id] = variables;
tabContent.push(variables.id);

export const initialUiState: UiState = { allContent, tabContent, selectedTabId: canvas.id };
