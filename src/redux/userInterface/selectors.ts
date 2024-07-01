import { AllAvailableContent, Content, ContentWithLabel, getAllAvailableContent, getAvailableContent } from './content';
import { RootState } from 'src/redux/store';
import { TabAreaContent } from './types';
import { createSelector } from '@reduxjs/toolkit';

export const getState = (state: RootState) => state;
export const getTabs = (state: RootState) => state.ui.tabs;
export const getTabAreaType = (state: RootState) => state.ui.tabs.type;
export const getTabSelectionOrder = (state: RootState) => state.ui.tabSelectionOrder;

export const getAllAvailableTabs = createSelector([getState], (state: RootState): AllAvailableContent => {
  return getAllAvailableContent({ state });
});

export const getTabContent = createSelector([getState], (state: RootState): Record<string, TabAreaContent> => {
  const tabAreaContentDict: Record<string, TabAreaContent> = {};
  for (const [area, contentList] of Object.entries(state.ui.tabs.content)) {
    const areaContent: ContentWithLabel[] = [];
    let selectedTab: Content | undefined = undefined;
    let selectedTabIndex = -1;
    contentList.forEach((content) => {
      const contentInfo = getAvailableContent({ contentId: content.contentId, type: content.type, state });
      areaContent.push({ ...content, label: contentInfo.label });
      const indexInTabSelectionOrder = state.ui.tabSelectionOrder.indexOf(content.tabId);
      if (indexInTabSelectionOrder > selectedTabIndex) {
        selectedTab = content;
        selectedTabIndex = indexInTabSelectionOrder;
      }
    });
    tabAreaContentDict[area] = { content: areaContent, selectedTab };
  }
  return tabAreaContentDict;
});
