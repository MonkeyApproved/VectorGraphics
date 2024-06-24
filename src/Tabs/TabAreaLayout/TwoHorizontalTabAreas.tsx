import styles from './styles.module.css';
import { useState } from 'react';
import Divider from './Divider';
import { valueWithMinMax } from 'src/redux/utils';
import { useRefElementSize } from './ref';
import TabArea from '../TabArea';
import { DIVIDER_WIDTH } from './const';

export default function TwoHorizontalTabAreas() {
  const [dividerPos, setDividerPos] = useState<number>();
  const [dragActive, setDragActive] = useState(false);
  const { ref, width } = useRefElementSize<HTMLDivElement>();

  const columnWidth = valueWithMinMax({ value: dividerPos, min: 200, max: width - 200 });
  const columns = columnWidth ? `${columnWidth}px ${DIVIDER_WIDTH} 1fr` : `1fr ${DIVIDER_WIDTH} 1fr`;

  return (
    <div className={styles.twoHorizontal} style={{ gridTemplateColumns: columns, gridArea: 'tabAreas' }} ref={ref}>
      <Divider
        dragBorderRef={ref}
        setDividerPos={setDividerPos}
        setDragActive={setDragActive}
        dimension="x"
        id="columnDivider"
        className={dragActive ? styles.dividerDrag : styles.dividerIdle}
        style={{ gridArea: 'divider' }}
      />
      <TabArea gridArea="left" />
      <TabArea gridArea="right" />
    </div>
  );
}
