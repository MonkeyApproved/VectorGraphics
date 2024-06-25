import cn from 'classnames';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import styles from './styles.module.css';
import Tab from './Tab';
import { Content } from 'src/redux/content';

export interface TabAreaProps<Positions extends string> {
  tabDragActive: boolean;
  setTabDragActive: Dispatch<SetStateAction<boolean>>;
  position: Positions;
  contentList: Content[];
  style?: CSSProperties;
}

export default function TabArea<Positions extends string>({
  tabDragActive,
  setTabDragActive,
  position,
  contentList,
  style,
}: TabAreaProps<Positions>) {
  return (
    <div className={styles.tabArea} style={{ gridArea: position, ...style }} id="tabArea">
      <div className={styles.tabList}>
        {contentList.map((content) => (
          <Tab
            key={`${position}-${content.tabId}`}
            content={content}
            selected={content.selected || false}
            tabDragActive={tabDragActive}
            setTabDragActive={setTabDragActive}
          />
        ))}
      </div>
      <div className={cn(styles.tabOptions, 'noSelect')}>...</div>
      <div className={cn(styles.tabContent, 'noSelect')}></div>
    </div>
  );
}
