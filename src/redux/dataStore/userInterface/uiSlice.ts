import { ContentDict } from './contentDict';
import { ContentGroup } from './contentGroup';
import { DataExplorer, getNewDataExplorer } from './dataExplorer';
import { SvgEditor, getNewSvgEditor } from './svgEditor';
import { VariableTable, getNewVariableTable } from './variableTable';

export interface UiState {
  allContent: ContentDict;
  tabs: ContentGroup;
}

const allContent: ContentDict = {};
const tabContent: string[] = [];

const data: DataExplorer = getNewDataExplorer({ label: 'Data', containerId: 'tabs' });
allContent[data.id] = data;
tabContent.push(data.id);

const canvas: SvgEditor = getNewSvgEditor({ label: 'Canvas', containerId: 'tabs' });
allContent[canvas.id] = canvas;
tabContent.push(canvas.id);

const variables: VariableTable = getNewVariableTable({ label: 'Variables', containerId: 'tabs' });
allContent[variables.id] = variables;
tabContent.push(variables.id);

export const initialUiState: UiState = {
  allContent,
  tabs: { contentList: tabContent, selected: data.id },
};
