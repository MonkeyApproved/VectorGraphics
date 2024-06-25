import { useState } from 'react';
import TabArea from '../TabArea';
import styles from './styles.module.css';
import { SingleTabAreaPosition } from 'src/redux/types';
import { Content } from 'src/redux/content';

export default function SingleTabArea({ content }: { content: Record<SingleTabAreaPosition, Content[]> }) {
  const [tabDragActive, setTabDragActive] = useState(false);

  return (
    <div className={styles.single} style={{ gridArea: 'tabAreas' }}>
      <TabArea<SingleTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="center"
        contentList={content.center}
      />
    </div>
  );
}
