import { AllAvailableContent, Content, ContentWithLabel, getAllAvailableContent, getAvailableContent } from './content';
import { RootState } from 'src/redux/store';
import { getContentList } from './tabUtils';
import { TabPosition } from './types';

export const getTabAreaType = (state: RootState) => state.ui.tabs.type;

export const getTabAreaContent =
  ({ position }: { position: TabPosition }) =>
  (state: RootState): ContentWithLabel[] => {
    const contentList: Content[] = getContentList({ position, tabs: state.ui.tabs });
    return contentList.map((content) => {
      const contentInfo = getAvailableContent({ contentId: content.contentId, type: content.type, state });
      return { ...content, ...contentInfo } as ContentWithLabel;
    });
  };

export const getAllAvailableTabs = (state: RootState): AllAvailableContent => {
  return getAllAvailableContent({ state });
};
