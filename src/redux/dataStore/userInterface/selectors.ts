import { RootState } from 'redux/store';

export const getTabContentIds = (state: RootState) => state.data.userInterface.tabContent;

export const getTabContent = (state: RootState) =>
  state.data.userInterface.tabContent.map((id: string) => state.data.userInterface.allContent[id]);

export const getSelectedTabId = (state: RootState) => state.data.userInterface.selectedTabId;

export const getSelectedTabIndex = (state: RootState) => {
  if (!state.data.userInterface.selectedTabId) return false;
  const index = state.data.userInterface.tabContent.indexOf(state.data.userInterface.selectedTabId);
  return index === -1 ? false : index;
};

export const getMainContent = (contentId: string) => (state: RootState) =>
  state.data.userInterface.allContent[contentId];
