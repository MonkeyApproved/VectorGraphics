import cn from 'classnames';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import styles from './styles.module.css';
import Tab from './Tab';
import Content from './Content';
import { TabAreaContent } from 'src/redux/types';

export interface TabAreaProps<Positions extends string> {
  tabDragActive: boolean;
  setTabDragActive: Dispatch<SetStateAction<boolean>>;
  position: Positions;
  tabAreaContent: TabAreaContent;
  style?: CSSProperties;
}

export default function TabArea<Positions extends string>({
  tabDragActive,
  setTabDragActive,
  position,
  tabAreaContent,
  style,
}: TabAreaProps<Positions>) {
  return (
    <div className={styles.tabArea} style={{ gridArea: position, ...style }} id="tabArea">
      <div className={styles.tabList}>
        {tabAreaContent.content.map((content) => (
          <Tab
            key={`${position}-${content.tabId}`}
            content={content}
            selected={tabAreaContent.selectedTab?.tabId === content.tabId}
            tabDragActive={tabDragActive}
            setTabDragActive={setTabDragActive}
          />
        ))}
      </div>
      <div className={cn(styles.tabOptions, 'noSelect')}>...</div>
      <div className={cn(styles.tabContent, 'noSelect')}></div>
      <div className={styles.tabContent}>
        <Content selectedTab={tabAreaContent.selectedTab} />
      </div>
    </div>
  );
}
