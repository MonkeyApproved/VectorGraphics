import { RootState } from 'redux/store';

export const getTabContentIds = (state: RootState) => state.data.userInterface.tabs.contentList;

export const getTabContent = (state: RootState) =>
  state.data.userInterface.tabs.contentList.map((id: string) => state.data.userInterface.allContent[id]);

export const getSelectedTabId = (state: RootState) => state.data.userInterface.tabs.selected;

export const getSelectedTabIndex = (state: RootState) => {
  if (!state.data.userInterface.tabs.selected) return false;
  const index = state.data.userInterface.tabs.contentList.indexOf(state.data.userInterface.tabs.selected);
  return index === -1 ? false : index;
};

export const getContent = (contentId: string) => (state: RootState) => state.data.userInterface.allContent[contentId];
