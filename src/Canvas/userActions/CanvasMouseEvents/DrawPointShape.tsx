import { Coordinate, NewShape, ShapeType } from 'src/redux/types';
import { ElementSelection } from '../svgStateManagement/selectElement';
import { getMousePosition } from '../utils';
import { getNewShape } from 'src/redux/utils';
// import { removeElement } from '../svgStateManagement/removeElement';
import { addElementToCanvas, useAppDispatch } from 'src/redux/reducers';
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from 'react';
import { setShapeAttributes } from '../svgStateManagement/updateShape';
import { ClickEvent, checkDoubleClick } from './doubleClick';

export interface DrawSimpleShapeProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  shapeType: ShapeType;
  mouseDownPosition: Coordinate;
  tempShape: ElementSelection;
  setMouseActionActive: Dispatch<SetStateAction<boolean>>;
}

export default function DrawPointShape({
  canvasId,
  canvasRef,
  shapeType,
  mouseDownPosition,
  tempShape,
  setMouseActionActive,
}: DrawSimpleShapeProps) {
  const finishedSegments = useRef<NewShape>();
  const mouseClicks = useRef<ClickEvent[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.addEventListener('mousemove', updateCurrentSegment);
    document.body.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', submitShape);

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
    console.warn('update');
    // update the temp shape with the current mouse position
    const currentShape = getCurrentShape({ event });
    setShapeAttributes({ shape: currentShape, selection: tempShape });
  };

  const addSegment = (event: MouseEvent) => {
    console.warn('add segment');
    // update the shape and update finished segments
    const currentShape = getCurrentShape({ event });
    setShapeAttributes({ shape: currentShape, selection: tempShape });
    finishedSegments.current = currentShape;
  };

  const submitShape = (event: MouseEvent) => {
    console.warn('submit');
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

  return null;
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
