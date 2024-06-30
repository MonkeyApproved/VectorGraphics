import { getCanvas, getSelectedElementIds, useAppSelector } from 'src/redux/selectors';
import SelectedElements from '../SelectElements/SelectedElements';
import styles from '../styles.module.css';
import { getTopCanvasId } from 'src/redux/utils';
import { ReactMouseEvent } from '../../types';

export interface IdleProps {
  canvasId: string;
  onMouseDown: (event: ReactMouseEvent) => void;
}

export default function Idle({ canvasId, onMouseDown }: IdleProps) {
  // current redux state
  const selectedElements = useAppSelector((state) => getSelectedElementIds(state, canvasId));
  const canvas = useAppSelector((state) => getCanvas(state, canvasId));
  const topCanvasId = getTopCanvasId({ canvasId });

  return (
    <svg className={styles.mouseListener} id={topCanvasId} viewBox={canvas.viewBox} onMouseDown={onMouseDown}>
      {<SelectedElements canvasId={canvasId} selectedElements={selectedElements} showMinimalRect={true} />}
    </svg>
  );
}
