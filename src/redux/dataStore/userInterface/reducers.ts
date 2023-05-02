import { DataSliceReducer } from '../dataSlice';
import { MainContentTypes, getNewMainContent } from './mainContent';
import { addEquationToVariableTable } from './variableTable';

const addVariable: DataSliceReducer<{ equationId: string; variableTableId: string }> = (state, { payload }) => {
  addEquationToVariableTable({ ...payload, state });
};

const addNewContentToTabs: DataSliceReducer<{ type: MainContentTypes; label: string }> = (state, { payload }) => {
  // create new content, add it to dict and to tabs
  const content = getNewMainContent({ containerId: 'tabs', ...payload });
  state.userInterface.allContent[content.id] = content;
  state.userInterface.tabContent.push(content.id);

  // select the newly added content
  state.userInterface.selectedTabId = content.id;
};

const removeContentFromTabs: DataSliceReducer<{ id: string }> = (state, { payload }) => {
  const index = state.userInterface.tabContent.indexOf(payload.id, 0);
  if (index === -1) {
    throw new Error(`Content id "${payload.id}" currently not a tab, removing content failed.`);
  }
  // remove content from tab
  state.userInterface.tabContent.splice(index, 1);

  if (state.userInterface.selectedTabId !== payload.id) {
    return;
  }
  // the content was the currently selected tab, we try to select the neighboring content
  if (state.userInterface.tabContent.length === 0) {
    // no more tabs -> cannot select any content until new content is added
    state.userInterface.selectedTabId = undefined;
  } else if (state.userInterface.tabContent.length > index) {
    // select content that is now in the same position as the removed content
    state.userInterface.selectedTabId = state.userInterface.tabContent[index];
  } else {
    // removed content was last in list -> again select content in last position
    state.userInterface.selectedTabId = state.userInterface.tabContent[index - 1];
  }
};

const selectTab: DataSliceReducer<{ id: string }> = (state, { payload }) => {
  if (!state.userInterface.tabContent.includes(payload.id)) {
    throw new Error(`Cannot select tab "${payload.id}", as it is not currently a tab.`);
  }
  state.userInterface.selectedTabId = payload.id;
};

export const uiReducers = {
  addVariable,
  addNewContentToTabs,
  removeContentFromTabs,
  selectTab,
};
