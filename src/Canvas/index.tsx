import styles from './styles.module.css';
import { getCanvas, useAppSelector } from 'src/redux/selectors';
import { getMainCanvasId } from 'src/redux/utils';
import { useRef } from 'react';
import Element from './Element';
import { UserInterface } from './UserInterface';

export default function Canvas({ canvasId }: { canvasId: string }) {
  // current redux state
  const canvas = useAppSelector(getCanvas({ canvasId }));
  // main canvas attributes: this canvas displays the current state of the store
  const mainCanvasId = getMainCanvasId({ canvasId });
  const mainCanvasRef = useRef<SVGSVGElement>(null);
  // elements in canvas
  const svgElements = canvas.elementIds.map((elementId) => (
    <Element key={elementId} elementId={elementId} canvasId={canvasId} />
  ));

  return (
    <>
      <div className={styles.canvasWrapper}>
        <svg className={styles.canvas} id={mainCanvasId} viewBox={canvas.viewBox} ref={mainCanvasRef}>
          {svgElements}
        </svg>
        <UserInterface canvasId={canvasId} canvasRef={mainCanvasRef} />
      </div>
    </>
  );
}
