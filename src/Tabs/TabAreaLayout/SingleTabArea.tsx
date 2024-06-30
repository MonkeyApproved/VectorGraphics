import { useState } from 'react';
import TabArea from '../TabArea';
import styles from './styles.module.css';
import { SingleTabAreaPosition } from 'src/redux/types';
import { getTabContent, useAppSelector } from 'src/redux/selectors';

export default function SingleTabArea() {
  const [tabDragActive, setTabDragActive] = useState(false);
  const content = useAppSelector((state) => getTabContent(state));

  return (
    <div className={styles.single} style={{ gridArea: 'tabAreas' }}>
      <TabArea<SingleTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="center"
        tabAreaContent={content.center}
      />
    </div>
  );
}
