/* eslint-disable no-console */
import { getCanvas, getSvgCanvasIds, updateCanvasOnMouseAction, useAppSelector } from 'src/redux';
import styles from './styles.module.css';
import MenuGrid from './MenuGrid';
import { BaseSyntheticEvent, useState } from 'react';
import { MouseEventTracker, updateMouseEvent } from 'src/mouseHandlers';

export default function Canvas({ canvasId }: { canvasId: string }) {
  const [mouseEventTracker, setMouseEventTracker] = useState<MouseEventTracker>({ type: 'idle' });
  const canvas = useAppSelector(getCanvas({ canvasId }));
  const svgIds = getSvgCanvasIds({ canvasId: canvas.id });
  const status = useAppSelector(updateCanvasOnMouseAction({ mouseTracker: mouseEventTracker, canvasId: canvas.id }));

  const updateMouseEventTracker = (event: BaseSyntheticEvent) => {
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
          onMouseDown={(event) => updateMouseEventTracker(event as BaseSyntheticEvent)}
          onMouseMove={(event) => updateMouseEventTracker(event as BaseSyntheticEvent)}
          onMouseUp={(event) => updateMouseEventTracker(event as BaseSyntheticEvent)}
          onMouseLeave={(event) => updateMouseEventTracker(event as BaseSyntheticEvent)}
        />
        <svg className={styles.topCanvas} id={svgIds.topId} viewBox={canvas.viewBox} />
      </div>
      <MenuGrid canvas={canvas} status={status} />
    </>
  );
}
