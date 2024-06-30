import styles from './styles.module.css';
import { useState } from 'react';
import Divider from './Divider';
import { useRefElementSize } from './ref';
import { valueWithMinMax } from 'src/redux/utils';
import TabArea from '../TabArea';
import { DIVIDER_WIDTH } from './const';
import { VerticalTabAreaPosition } from 'src/redux/types';
import { getTabContent, useAppSelector } from 'src/redux/selectors';

export default function TwoVerticalTabAreas() {
  const [tabDragActive, setTabDragActive] = useState(false);
  const [dividerPos, setDividerPos] = useState<number>();
  const [dragActive, setDragActive] = useState(false);
  const { ref, height } = useRefElementSize<HTMLDivElement>();
  const content = useAppSelector((state) => getTabContent(state));

  const rowHeight = valueWithMinMax({ value: dividerPos, min: 100, max: height - 100 });
  const rows = rowHeight ? ` ${rowHeight}px ${DIVIDER_WIDTH} 1fr` : `1fr ${DIVIDER_WIDTH} 1fr`;

  return (
    <div className={styles.twoVertical} style={{ gridTemplateRows: rows, gridArea: 'tabAreas' }} ref={ref}>
      <Divider
        setDividerPos={setDividerPos}
        setDragActive={setDragActive}
        dimension="y"
        id="rowDivider"
        className={dragActive ? styles.dividerDrag : styles.dividerIdle}
        style={{ gridArea: 'divider' }}
      />
      <TabArea<VerticalTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="top"
        tabAreaContent={content.top}
      />
      <TabArea<VerticalTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="bottom"
        tabAreaContent={content.bottom}
      />
    </div>
  );
}