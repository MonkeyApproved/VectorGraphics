import styles from './styles.module.css';
import { useState } from 'react';
import Divider from './Divider';
import { useRefElementSize } from './ref';
import { valueWithMinMax } from 'src/redux/utils';
import TabArea from '../TabArea';
import { DIVIDER_WIDTH } from './const';
import { QuadrantTabAreaPosition } from 'src/redux/types';
import { Content } from 'src/redux/content';

export default function QuadrantTabAreas({ content }: { content: Record<QuadrantTabAreaPosition, Content[]> }) {
  const [tabDragActive, setTabDragActive] = useState(false);
  const [dividerXPos, setDividerXPos] = useState<number>();
  const [dividerYPos, setDividerYPos] = useState<number>();
  const [dragXActive, setDragXActive] = useState(false);
  const [dragYActive, setDragYActive] = useState(false);
  const { width, height, ref } = useRefElementSize<HTMLDivElement>();

  const columnWidth = valueWithMinMax({ value: dividerXPos, min: 200, max: width - 200 });
  const rowHeight = valueWithMinMax({ value: dividerYPos, min: 100, max: height - 100 });
  const columns = columnWidth ? `${columnWidth}px ${DIVIDER_WIDTH} 1fr` : `1fr ${DIVIDER_WIDTH} 1fr`;
  const rows = rowHeight ? ` ${rowHeight}px ${DIVIDER_WIDTH} 1fr` : `1fr ${DIVIDER_WIDTH} 1fr`;

  return (
    <div
      className={styles.quadrant}
      style={{ gridTemplateRows: rows, gridTemplateColumns: columns, gridArea: 'tabAreas' }}
      ref={ref}
    >
      <Divider
        dragBorderRef={ref}
        setDividerPos={setDividerXPos}
        setDragActive={setDragXActive}
        dimension="x"
        id="columnDivider"
        className={dragXActive ? styles.dividerDrag : styles.dividerIdle}
        style={{ gridArea: 'dividerHorizontal' }}
      />
      <Divider
        dragBorderRef={ref}
        setDividerPos={setDividerYPos}
        setDragActive={setDragYActive}
        dimension="y"
        id="rowDividerLeft"
        className={dragYActive ? styles.dividerDrag : styles.dividerIdle}
        style={{ gridArea: 'dividerVertical' }}
      />
      <Divider
        dragBorderRef={ref}
        setDividerPos={setDividerYPos}
        setDragActive={setDragYActive}
        dimension="y"
        id="rowDividerRight"
        className={dragYActive ? styles.dividerDrag : styles.dividerIdle}
        style={{ gridArea: 'dividerVertical2' }}
      />
      <TabArea<QuadrantTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="topLeft"
        contentList={content.topLeft}
      />
      <TabArea<QuadrantTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="topRight"
        contentList={content.topRight}
      />
      <TabArea<QuadrantTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="bottomLeft"
        contentList={content.bottomLeft}
      />
      <TabArea<QuadrantTabAreaPosition>
        tabDragActive={tabDragActive}
        setTabDragActive={setTabDragActive}
        position="bottomRight"
        contentList={content.bottomRight}
      />
    </div>
  );
}
