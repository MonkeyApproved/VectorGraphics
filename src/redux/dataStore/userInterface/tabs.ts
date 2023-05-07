import { DataSliceReducer } from '../dataSlice';
import { MainContentTypes } from './content';
import { addContentToDict } from './contentDict';
import { addContentToGroup, removeContentFromGroup } from './contentGroup';

const addNewContentToTabs: DataSliceReducer<{ type: MainContentTypes; label: string }> = (state, { payload }) => {
  // create new content, add it to dict and to tabs
  const content = addContentToDict({ dict: state.userInterface.allContent, ...payload });
  addContentToGroup({ group: state.userInterface.tabs, contentId: content.id });
};

const removeContentFromTabs: DataSliceReducer<{ id: string }> = (state, { payload }) => {
  removeContentFromGroup({ group: state.userInterface.tabs, contentId: payload.id });
};

const selectTab: DataSliceReducer<{ id: string }> = (state, { payload }) => {
  if (!state.userInterface.tabs.contentList.includes(payload.id)) {
    throw new Error(`Cannot select tab "${payload.id}", as it is not currently a tab.`);
  }
  state.userInterface.tabs.selected = payload.id;
};

export const mainTabReducers = {
  addNewContentToTabs,
  removeContentFromTabs,
  selectTab,
};
