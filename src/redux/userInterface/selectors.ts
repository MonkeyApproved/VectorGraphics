import { AllAvailableContent, Content, ContentWithLabel, getAllAvailableContent, getAvailableContent } from './content';
import { RootState } from 'src/redux/store';
import { TabAreaContent } from './types';

export const getTabAreaType = (state: RootState) => state.ui.tabs.type;

export const getTabs = (state: RootState) => state.ui.tabs;

export const getAllAvailableTabs = (state: RootState): AllAvailableContent => {
  return getAllAvailableContent({ state });
};

export function getTabContent<T extends string>(state: RootState): Record<T, TabAreaContent> {
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
}
