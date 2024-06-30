import { Coordinate, NewShape } from 'src/redux/types';
import { getMousePosition } from '../../utils';
import { getNewShape, getTopCanvasId } from 'src/redux/utils';
import { addElementToCanvas, useAppDispatch } from 'src/redux/reducers';
import { useEffect, useRef, useState } from 'react';
import { ClickEvent, checkDoubleClick } from '../doubleClick';
import { DrawShapeProps } from '.';
import TempShape from './TempShape';
import styles from '../styles.module.css';
import { getCanvas, useAppSelector } from 'src/redux/selectors';

export default function DrawPointShape({
  canvasId,
  canvasRef,
  shapeType,
  mouseDownPosition,
  setMouseActionActive,
  setStatus,
}: DrawShapeProps) {
  const canvas = useAppSelector((state) => getCanvas(state, canvasId));
  const topCanvasId = getTopCanvasId({ canvasId });
  const [tempShape, setTempShape] = useState<NewShape>(getNewShape({ shapeType, start: mouseDownPosition }));
  const finishedSegments = useRef<NewShape>();
  const mouseClicks = useRef<ClickEvent[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.addEventListener('mousemove', updateCurrentSegment);
    document.body.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', submitShape);
    setStatus('click to add segment; double click to finish');

    return () => {
      document.body.removeEventListener('mousemove', updateCurrentSegment);
      document.body.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', submitShape);
    };
  }, []);

  const getCurrentShape = ({ event }: { event: MouseEvent }): NewShape => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    if (!finishedSegments.current) {
      return getNewShape({
        shapeType: shapeType,
        start: mouseDownPosition,
        end: currentPosition,
      });
    }
    return appendFinishedSegments({ finishedSegments: finishedSegments.current, currentPosition });
  };

  const updateCurrentSegment = (event: MouseEvent) => {
    // update the temp shape with the current mouse position
    setTempShape(getCurrentShape({ event }));
  };

  const addSegment = (event: MouseEvent) => {
    // update the shape and update finished segments
    const currentShape = getCurrentShape({ event });
    setTempShape(currentShape);
    finishedSegments.current = currentShape;
  };

  const submitShape = (event: MouseEvent) => {
    // update the shape with the final mouse position
    const finalShape = getCurrentShape({ event });

    // now we can remove the temp shape and submit the final shape to the store
    // removeElement({ selection: tempShape });
    setMouseActionActive(false);
    dispatch(addElementToCanvas({ canvasId, shape: finalShape }));
  };

  const onMouseUp = (event: MouseEvent) => {
    // update the mouse click tracker and check if this was a double click
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    mouseClicks.current = [...mouseClicks.current, { position: currentPosition, time: event.timeStamp }];
    const isDoubleClick = checkDoubleClick({ mouseClicks: mouseClicks.current });

    if (isDoubleClick) {
      // double click indicates the end of the drawing action
      submitShape(event);
    } else {
      // single click adds a new segment to the shape
      addSegment(event);
    }
  };

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={canvas.viewBox}>
      <TempShape tempShape={tempShape} canvasId={canvasId} />
    </svg>
  );
}

export function appendFinishedSegments({
  finishedSegments,
  currentPosition,
}: {
  finishedSegments: NewShape;
  currentPosition: Coordinate;
}): NewShape {
  if (finishedSegments.type === 'polygon' || finishedSegments.type === 'polyline') {
    // add the current coordinate as the next point
    return {
      ...finishedSegments,
      points: [...finishedSegments.points, currentPosition],
    };
  } else if (finishedSegments.type === 'path') {
    // extend by drawing a line to the current coordinate
    return {
      ...finishedSegments,
      segments: [...finishedSegments.segments, { type: 'line', endPoint: currentPosition }],
    };
  }
  return finishedSegments;
}
