import { RefObject } from 'react';
import { getCanvasViewBox, getCanvasViewBoxString, useAppSelector } from 'src/redux/selectors';
import { getBottomCanvasId } from 'src/redux/utils';
import styles from './styles.module.css';

export interface CanvasBackgroundProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
}

export default function CanvasBackground({ canvasId, canvasRef }: CanvasBackgroundProps) {
  // current redux state
  const viewBox = useAppSelector((state) => getCanvasViewBox(state, canvasId));
  const viewBoxString = useAppSelector((state) => getCanvasViewBoxString(state, canvasId));
  // main canvas attributes: this canvas displays the current state of the store
  const bottomCanvasId = getBottomCanvasId({ canvasId });

  return (
    <svg id={bottomCanvasId} ref={canvasRef} className={styles.bottomCanvas} viewBox={viewBoxString}>
      <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill="#444444" />
    </svg>
  );
}
