import { BaseSyntheticEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { mouseDown, mouseDrag, mouseUp, setCanvasId } from 'redux/dataStore/dataSlice';
import styles from '../../styles/SvgCanvas.module.css';
import { getMouseEventStatus } from 'redux/dataStore/dataSelectors';
import { getMousePosition } from 'redux/dataStore/svg/coordinate';

export interface SvgCanvasProps {
  svgId: string;
  viewBox: string;
}

export default function SvgCanvas({ svgId, viewBox }: SvgCanvasProps) {
  const mouseState = useAppSelector(getMouseEventStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // set the canvas id after this component is mounted
    dispatch(setCanvasId({ canvasId: svgId }));
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
    <svg
      className={styles.canvas}
      id={svgId}
      viewBox={viewBox}
      onMouseDown={(event) => handleMouseDown(event as BaseSyntheticEvent)}
      onMouseMove={(event) => handleMouseMove(event as BaseSyntheticEvent)}
      onMouseUp={(event) => handleMouseUp(event as BaseSyntheticEvent)}
      onMouseLeave={(event) => handleMouseUp(event as BaseSyntheticEvent)}
    />
  );
}
