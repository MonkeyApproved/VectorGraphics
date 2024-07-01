import { Content } from '../content';
import { UiState } from '../slice';

export const mockContent: { [key: string]: Content } = {
  var1: {
    tabId: 'tab1',
    type: 'variableManager',
    contentId: 'variableManager1',
    position: { vertical: 'top', horizontal: 'left' },
  },
  var2: {
    tabId: 'tab2',
    type: 'variableManager',
    contentId: 'variableManager2',
    position: { vertical: 'bottom', horizontal: 'right' },
  },
  canvas1: {
    tabId: 'tab3',
    type: 'canvas',
    contentId: 'canvas1',
    position: { vertical: 'top', horizontal: 'left' },
  },
  canvas2: {
    tabId: 'tab4',
    type: 'canvas',
    contentId: 'canvas2',
    position: { vertical: 'top', horizontal: 'right' },
  },
  spreadsheet1: {
    tabId: 'tab5',
    type: 'spreadsheet',
    contentId: 'spreadsheet1',
    position: { vertical: 'bottom', horizontal: 'left' },
  },
  spreadsheet2: {
    tabId: 'tab6',
    type: 'spreadsheet',
    contentId: 'spreadsheet2',
    position: { vertical: 'bottom', horizontal: 'right' },
  },
  dataExplorer1: {
    tabId: 'tab7',
    type: 'dataExplorer',
    contentId: 'dataExplorer1',
    position: { vertical: 'top', horizontal: 'right' },
  },
  dataExplorer2: {
    tabId: 'tab8',
    type: 'dataExplorer',
    contentId: 'dataExplorer2',
    position: { vertical: 'top', horizontal: 'left' },
  },
};

export const initialUiStates: { [key: string]: UiState } = {
  singleAreaOneEach: {
    tabCounter: 8,
    tabSelectionOrder: ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7', 'tab8'],
    tabs: {
      type: 'single',
      content: { center: [mockContent.canvas1, mockContent.var1, mockContent.spreadsheet1, mockContent.dataExplorer1] },
    },
  },
};
