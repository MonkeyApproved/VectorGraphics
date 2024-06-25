import styles from './styles.module.css';
import MenuGrid from './MenuGrid';
import { useEffect, useState } from 'react';
import { CanvasMouseEvent, MouseEventTracker, updateMouseEvent } from 'src/Canvas/eventHandlers';
import { getCanvas, getUIResponse, useAppSelector } from 'src/redux/selectors';
import { getSvgCanvasIds } from 'src/redux/utils';
import { addElementToCanvas, useAppDispatch } from 'src/redux/reducers';

export default function Canvas({ canvasId }: { canvasId: string }) {
  const [mouseEventTracker, setMouseEventTracker] = useState<MouseEventTracker>({ type: 'idle' });
  const dispatch = useAppDispatch();
  const canvas = useAppSelector(getCanvas({ canvasId }));
  const svgIds = getSvgCanvasIds({ canvasId: canvas.id });
  const uiResponse = useAppSelector(getUIResponse({ mouseTracker: mouseEventTracker, canvasId: canvas.id }), {
    devModeChecks: { stabilityCheck: 'never' },
  });

  useEffect(() => {
    if (uiResponse.type === 'drawShape' && uiResponse.completed) {
      // the user finished drawing the new shape, so we can submit it to the store
      dispatch(addElementToCanvas({ canvasId, shape: uiResponse.tempShape }));
    }
  }, [dispatch, uiResponse.type, uiResponse.completed]);

  useEffect(() => {
    // in some cases, the mouse tracker needs to be adjusted, based on the UI response
    if (uiResponse.mouseTrackerUpdate) {
      setMouseEventTracker(uiResponse.mouseTrackerUpdate);
    }
  }, [uiResponse.mouseTrackerUpdate?.type]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    document.addEventListener('keydown', (event) => console.log(event.key));
  }, []);

  const updateMouseEventTracker = (event: CanvasMouseEvent) => {
    const updatedTracker = updateMouseEvent({ eventTracker: mouseEventTracker, currentEvent: event });
    if (updatedTracker.type !== 'idle' && mouseEventTracker.type !== 'idle') {
      updatedTracker.finishedSegments = mouseEventTracker.finishedSegments;
    }
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
      <MenuGrid canvas={canvas} status={uiResponse.statusMessage} />
    </>
  );
}
