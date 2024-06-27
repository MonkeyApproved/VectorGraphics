import styles from './styles.module.css';
import MenuGrid from './MenuGrid';
import { getCanvas, useAppSelector } from 'src/redux/selectors';
import { getMainCanvasId } from 'src/redux/utils';
import { useRef } from 'react';
import CanvasMouseEvents from './userActions/CanvasMouseEvents';
import Element from './Element';

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
        {mainCanvasRef && <CanvasMouseEvents canvasId={canvasId} canvasRef={mainCanvasRef} />}
      </div>
      <MenuGrid canvas={canvas} status="status" />
    </>
  );
}
