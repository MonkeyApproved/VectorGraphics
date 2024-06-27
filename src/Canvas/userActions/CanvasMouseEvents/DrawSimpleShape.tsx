import { NewShape } from 'src/redux/types';
import { getMousePosition } from '../utils';
import { getNewShape, getTopCanvasId } from 'src/redux/utils';
import { addElementToCanvas, useAppDispatch } from 'src/redux/reducers';
import { useEffect, useState } from 'react';
import { DrawShapeProps } from './DrawShape';
import TempShape from './TempShape';
import styles from './styles.module.css';
import { getCanvas, useAppSelector } from 'src/redux/selectors';

export default function DrawSimpleShape({
  canvasId,
  canvasRef,
  shapeType,
  mouseDownPosition,
  setMouseActionActive,
}: DrawShapeProps) {
  const canvas = useAppSelector(getCanvas({ canvasId }));
  const topCanvasId = getTopCanvasId({ canvasId });
  const [tempShape, setTempShape] = useState<NewShape>(getNewShape({ shapeType, start: mouseDownPosition }));
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.addEventListener('mousemove', updateShape);
    document.body.addEventListener('mouseup', submitShape);
    document.body.addEventListener('mouseleave', submitShape);

    return () => {
      document.body.removeEventListener('mousemove', updateShape);
      document.body.removeEventListener('mouseup', submitShape);
      document.body.removeEventListener('mouseleave', submitShape);
    };
  }, []);

  const getCurrentShape = ({ event }: { event: MouseEvent }): NewShape => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    return getNewShape({
      shapeType: shapeType,
      start: mouseDownPosition,
      end: currentPosition,
    });
  };

  const updateShape = (event: MouseEvent) => {
    // update the temp shape with the current mouse position
    setTempShape(getCurrentShape({ event }));
  };

  const submitShape = (event: MouseEvent) => {
    // update the shape with the final mouse position
    const finalShape = getCurrentShape({ event });

    // now we can remove the temp shape and submit the final shape to the store
    dispatch(addElementToCanvas({ canvasId, shape: finalShape }));

    // finally, we inform CanvasMouseEvents that the current mouse action is finished
    setMouseActionActive(false);
  };

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={canvas.viewBox}>
      <TempShape tempShape={tempShape} canvasId={canvasId} />
    </svg>
  );
}
