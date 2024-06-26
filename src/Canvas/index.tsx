import styles from './styles.module.css';
import MenuGrid from './MenuGrid';
import { getCanvas, getCanvasElements, useAppSelector } from 'src/redux/selectors';
import { getSvgCanvasIds } from 'src/redux/utils';
import { useRef } from 'react';
import CanvasMouseEvents from './userActions/CanvasMouseEvents';
import Element from './Element';

export default function Canvas({ canvasId }: { canvasId: string }) {
  // redux state
  const canvas = useAppSelector(getCanvas({ canvasId }));
  const elements = useAppSelector(getCanvasElements({ canvasId }));

  const svgIds = getSvgCanvasIds({ canvasId: canvas.id });
  const mainCanvasRef = useRef<SVGSVGElement>(null);

  const svgElements = elements.map((element) => (
    <Element key={element.id} element={element} canvasRef={mainCanvasRef} />
  ));

  return (
    <>
      <div className={styles.canvasWrapper}>
        <svg className={styles.bottomCanvas} id={svgIds.bottomId} viewBox={canvas.viewBox} />
        <svg className={styles.canvas} id={svgIds.mainId} viewBox={canvas.viewBox} ref={mainCanvasRef}>
          {svgElements}
        </svg>
        <svg className={styles.topCanvas} id={svgIds.topId} viewBox={canvas.viewBox} />

        {mainCanvasRef && <CanvasMouseEvents canvasId={canvasId} canvasRef={mainCanvasRef} />}
      </div>
      <MenuGrid canvas={canvas} status="status" />
    </>
  );
}
