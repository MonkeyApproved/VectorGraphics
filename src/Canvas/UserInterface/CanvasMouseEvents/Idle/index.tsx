import { getCanvasViewBoxString, useAppSelector } from 'src/redux/selectors';
import { getTopCanvasId } from 'src/redux/utils';
import { ReactMouseEvent } from '../../types';
import Elements from '../Elements';
import SelectionRect from '../SelectionRect';
import styles from '../styles.module.css';

export interface IdleProps {
  canvasId: string;
  selectedElements: string[];
  onMouseDownCanvas: (event: ReactMouseEvent) => void;
  onMouseDownElement: (event: ReactMouseEvent, elementId: string) => void;
}

export default function Idle({ canvasId, selectedElements, onMouseDownCanvas, onMouseDownElement }: IdleProps) {
  // current redux state
  const viewBox = useAppSelector((state) => getCanvasViewBoxString(state, canvasId));
  const topCanvasId = getTopCanvasId({ canvasId });

  return (
    <svg className={styles.mouseListener} id={topCanvasId} viewBox={viewBox} onMouseDown={onMouseDownCanvas}>
      {selectedElements.length > 0 ? <SelectionRect canvasId={canvasId} selectedElements={selectedElements} /> : null}
      <Elements canvasId={canvasId} selectedElements={selectedElements} onMouseDownElement={onMouseDownElement} />
    </svg>
  );
}
