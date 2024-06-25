import cn from 'classnames';
import styles from './styles.module.css';
import { Dispatch, SetStateAction } from 'react';
import { ContentWithLabel } from 'src/redux/content';

export interface TabProps {
  content: ContentWithLabel;
  selected: boolean;
  tabDragActive: boolean;
  setTabDragActive: Dispatch<SetStateAction<boolean>>;
}

export default function Tab({ content, selected, tabDragActive }: TabProps) {
  const className = selected ? styles.tabActive : styles.tabInactive;

  let dragZones = <></>;
  if (tabDragActive) {
    dragZones = (
      <>
        <div className={styles.tabDragAreaLeft} />
        <div className={styles.tabDragAreaRight} />
      </>
    );
  }
  return (
    <div className={cn(className, 'noSelect')}>
      <span className={styles.tabTitle}>{content.label || content.contentId}</span>
      <span className={styles.tabClose}>x</span>
      {dragZones}
    </div>
  );
}
