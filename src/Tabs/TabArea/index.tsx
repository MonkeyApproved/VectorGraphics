import cn from 'classnames';
import { CSSProperties } from 'react';
import styles from './styles.module.css';

export interface TabAreaProps {
  gridArea?: string;
  style?: CSSProperties;
}

export default function TabArea({ gridArea, style }: TabAreaProps) {
  return (
    <div className={styles.tabArea} style={{ gridArea, ...style }} id="tabArea">
      <div className={styles.tabList}>
        <div className={cn(styles.tabInactive, 'noSelect')}>
          <span>Tab 1</span>
        </div>
        <div className={cn(styles.tabActive, 'noSelect')}>
          <span>Tab 2</span>
        </div>
        <div className={cn(styles.tabInactive, 'noSelect')}>
          <span>Tab with long name</span>
          <div className={styles.tabDragAreaLeft} />
          <div className={styles.tabDragAreaRight} />
        </div>
      </div>
      <div className={cn(styles.tabOptions, 'noSelect')}>...</div>
      <div className={cn(styles.tabContent, 'noSelect')}></div>
    </div>
  );
}
