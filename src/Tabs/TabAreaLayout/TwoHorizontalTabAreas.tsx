import styles from './styles.module.css';
import { useState } from 'react';
import Divider from './Divider';
import { valueWithMinMax } from 'src/redux/utils';
import { useRefElementSize } from './ref';
import TabArea from '../TabArea';
import { DIVIDER_WIDTH } from './const';
import { HorizontalTabAreaPosition } from 'src/redux/types';
import { getTabContent, useAppSelector } from 'src/redux/selectors';

export default function TwoHorizontalTabAreas() {
  const [tabDragActive, setTabDragActive] = useState(false);
  const [dividerPos, setDividerPos] = useState<number>();
  const [dragActive, setDragActive] = useState(false);
  const { ref, width } = useRefElementSize<HTMLDivElement>();
  const content = useAppSelector((state) => getTabContent(state));

  const columnWidth = valueWithMinMax({ value: dividerPos, min: 200, max: width - 200 });
  const columns = columnWidth ? `${columnWidth}px ${DIVIDER_WIDTH} 1fr` : `1fr ${DIVIDER_WIDTH} 1fr`;

  return (
    <div className={styles.twoHorizontal} style={{ gridTemplateColumns: columns, gridArea: 'tabAreas' }} ref={ref}>
      <Divider
        setDividerPos={setDividerPos}
        setDragActive={setDragActive}
        dimension="x"
        id="columnDivider"
        className={dragActive ? styles.dividerDrag : styles.dividerIdle}
        style={{ gridArea: 'divider' }}
      />
      <TabArea<HorizontalTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="left"
        tabAreaContent={content.left}
      />
      <TabArea<HorizontalTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="right"
        tabAreaContent={content.right}
      />
    </div>
  );
}
