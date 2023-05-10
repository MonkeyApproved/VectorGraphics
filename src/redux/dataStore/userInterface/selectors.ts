import { RootState } from 'redux/store';
import { Equation } from '../equations/equation';
import { AnyContent } from './content';

export const getTabContentIds = (state: RootState) => state.data.userInterface.tabs.contentList;

export const getTabContent = (state: RootState): AnyContent[] =>
  state.data.userInterface.tabs.contentList.map((id: string) => state.data.userInterface.allContent[id]);

export const getSelectedTabId = (state: RootState) => state.data.userInterface.tabs.selected;

export const getSelectedTabIndex = (state: RootState) => {
  if (!state.data.userInterface.tabs.selected) return false;
  const index = state.data.userInterface.tabs.contentList.indexOf(state.data.userInterface.tabs.selected);
  return index === -1 ? false : index;
};

export const getContentType = (id: string) => (state: RootState) => state.data.userInterface.allContent[id].type;
export const getContentLabel = (id: string) => (state: RootState) => state.data.userInterface.allContent[id].label;

export const getVariableTableEquation =
  (index: number, variableTableId: string) =>
  (state: RootState): Equation | undefined => {
    const content = state.data.userInterface.allContent[variableTableId];
    if (content.type !== 'variables') {
      throw new Error('Invalid content type.');
    }

    if (index >= content.variableIds.length) return undefined;
    const equationId = content.variableIds[index];
    return state.data.equations[equationId];
  };

export const getContent = (contentId: string) => (state: RootState) => state.data.userInterface.allContent[contentId];
