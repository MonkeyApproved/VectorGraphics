import { useEffect, useState } from 'react';
import { getFreshStats } from 'src/redux/canvas/utils';
import { addElementToCanvas, useAppDispatch } from 'src/redux/reducers';
import { getCanvasViewBoxString, useAppSelector } from 'src/redux/selectors';
import { NewShape } from 'src/redux/types';
import { getNewShape, getTopCanvasId } from 'src/redux/utils';
import { DrawShapeProps } from '.';
import { getMousePosition } from '../../utils';
import Elements from '../Elements';
import styles from '../styles.module.css';
import TempShape from './TempShape';

export default function DrawSimpleShape({
  canvasId,
  canvasRef,
  shapeType,
  mouseDownPosition,
  setElementShownInMenu,
  setMouseState,
}: DrawShapeProps) {
  const viewBox = useAppSelector((state) => getCanvasViewBoxString(state, canvasId));
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
    const tempShape = getCurrentShape({ event });
    setTempShape(tempShape);
    setElementShownInMenu({
      id: 'new element',
      stats: getFreshStats(),
      shape: { id: 'new shape', stats: getFreshStats(), ...tempShape },
    });
  };

  const submitShape = (event: MouseEvent) => {
    // update the shape with the final mouse position
    const finalShape = getCurrentShape({ event });

    // now we can remove the temp shape and submit the final shape to the store
    dispatch(addElementToCanvas({ canvasId, shape: finalShape }));

    // finally, we inform CanvasMouseEvents that the current mouse action is finished
    setMouseState('idle');
    setElementShownInMenu(undefined);
  };

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={viewBox}>
      <Elements canvasId={canvasId} selectedElements={[]} />
      <TempShape tempShape={tempShape} canvasId={canvasId} />
    </svg>
  );
}
