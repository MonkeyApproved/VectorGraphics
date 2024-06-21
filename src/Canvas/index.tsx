import styles from './styles.module.css';
import MenuGrid from './MenuGrid';
import { MouseEvent, useState } from 'react';
import { MouseEventTracker, updateMouseEvent } from 'src/mouseHandlers';
import { getCanvas, updateCanvasOnMouseAction, useAppSelector } from 'src/redux/selectors';
import { getSvgCanvasIds } from 'src/redux/utils';

export default function Canvas({ canvasId }: { canvasId: string }) {
  const [mouseEventTracker, setMouseEventTracker] = useState<MouseEventTracker>({ type: 'idle' });
  const canvas = useAppSelector(getCanvas({ canvasId }));
  const svgIds = getSvgCanvasIds({ canvasId: canvas.id });
  const status = useAppSelector(updateCanvasOnMouseAction({ mouseTracker: mouseEventTracker, canvasId: canvas.id }));

  const updateMouseEventTracker = (event: MouseEvent<SVGSVGElement>) => {
    const updatedTracker = updateMouseEvent({ eventTracker: mouseEventTracker, currentEvent: event });
    setMouseEventTracker(updatedTracker);
  };

  return (
    <>
      <div className={styles.canvasWrapper}>
        <svg className={styles.bottomCanvas} id={svgIds.bottomId} viewBox={canvas.viewBox} />
        <svg
          className={styles.canvas}
          id={svgIds.mainId}
          viewBox={canvas.viewBox}
          onMouseDown={(event) => updateMouseEventTracker(event)}
          onMouseMove={(event) => updateMouseEventTracker(event)}
          onMouseUp={(event) => updateMouseEventTracker(event)}
          onMouseLeave={(event) => updateMouseEventTracker(event)}
        />
        <svg className={styles.topCanvas} id={svgIds.topId} viewBox={canvas.viewBox} />
      </div>
      <MenuGrid canvas={canvas} status={status} />
    </>
  );
}
