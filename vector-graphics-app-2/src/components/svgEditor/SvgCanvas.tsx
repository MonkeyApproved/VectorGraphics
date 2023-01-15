import { BaseSyntheticEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { mouseDown, mouseDrag, mouseUp, setBottomCanvasId, setCanvasId } from 'redux/dataStore/dataSlice';
import styles from './SvgCanvas.module.css';
import { getMousePosition } from 'redux/dataStore/svg/coordinate';
import { getMouseEventStatus } from 'redux/dataStore/handlers/selectors';

export interface SvgCanvasProps {
  canvasId: string;
  bottomCanvasId: string;
  viewBox: string;
}

export default function SvgCanvas({ canvasId, bottomCanvasId, viewBox }: SvgCanvasProps) {
  const mouseState = useAppSelector(getMouseEventStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // set the canvas ids after this component is mounted
    dispatch(setCanvasId({ canvasId }));
    dispatch(setBottomCanvasId({ canvasId: bottomCanvasId }));
  }, []);

  const handleMouseDown = (event: BaseSyntheticEvent) => {
    const targetId = event.target.id;
    const canvasPosition = getMousePosition({ event });
    if (targetId && canvasPosition) {
      dispatch(mouseDown({ targetId, canvasPosition }));
    }
  };

  const handleMouseUp = (event: BaseSyntheticEvent) => {
    if (mouseState !== 'idle') {
      const canvasPosition = getMousePosition({ event });
      dispatch(mouseUp({ canvasPosition }));
    }
  };

  const handleMouseMove = (event: BaseSyntheticEvent) => {
    if (mouseState !== 'idle') {
      const canvasPosition = getMousePosition({ event });
      dispatch(mouseDrag({ canvasPosition }));
    }
  };

  return (
    <div className={styles.canvasWrapper}>
      <svg className={styles.bottomCanvas} id={bottomCanvasId} viewBox={viewBox} />
      <svg
        className={styles.canvas}
        id={canvasId}
        viewBox={viewBox}
        onMouseDown={(event) => handleMouseDown(event as BaseSyntheticEvent)}
        onMouseMove={(event) => handleMouseMove(event as BaseSyntheticEvent)}
        onMouseUp={(event) => handleMouseUp(event as BaseSyntheticEvent)}
        onMouseLeave={(event) => handleMouseUp(event as BaseSyntheticEvent)}
      />
    </div>
  );
}
