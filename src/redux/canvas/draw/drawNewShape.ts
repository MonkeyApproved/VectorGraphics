import { MouseDragActive, MouseDragFinished, MouseEventTracker } from 'src/mouseHandlers';
import { Canvas, DrawAction } from '../canvas';
import { selectTempShape } from '.';
import { getNewShape } from '../shape';
import { setShapeAttributes } from './updateShape';

export interface DrawTempShapeProps<T> {
  mouseTracker: T;
  canvas: Canvas<DrawAction>;
}

export default function drawNewShape({ canvas, mouseTracker }: DrawTempShapeProps<MouseEventTracker>): string {
  if (mouseTracker.type === 'idle') {
    // nothing to do
    return `please draw a ${canvas.currentUserAction.shapeType}`;
  } else if (mouseTracker.type === 'mouseDown') {
    // we first wait to see if this is going to be a click or a drag
    return `adding ${canvas.currentUserAction.shapeType}`;
  } else if (mouseTracker.type === 'mouseMoveActive') {
    return handleMouseDragActive({ mouseTracker, canvas });
  } else if (mouseTracker.type === 'mouseMoveFinished') {
    return handleMouseDragFinished({ mouseTracker, canvas });
  }
  return 'nothing to do';
}

function handleMouseDragActive({ mouseTracker, canvas }: DrawTempShapeProps<MouseDragActive>) {
  const shapeType = canvas.currentUserAction.shapeType;
  const tempShapeSelection = selectTempShape({ canvas });
  const tempShape = getNewShape({
    shapeType,
    start: mouseTracker.start,
    end: mouseTracker.current,
  });
  setShapeAttributes({ shape: tempShape, selection: tempShapeSelection });
  return `adding ${canvas.currentUserAction.shapeType}  (${mouseTracker.current.x}, ${mouseTracker.current.y})`;
}

function handleMouseDragFinished({ mouseTracker, canvas }: DrawTempShapeProps<MouseDragFinished>) {
  const shapeType = canvas.currentUserAction.shapeType;
  const tempShapeSelection = selectTempShape({ canvas });
  const tempShape = getNewShape({
    shapeType,
    start: mouseTracker.start,
    end: mouseTracker.end,
  });
  setShapeAttributes({ shape: tempShape, selection: tempShapeSelection });
  return `adding ${canvas.currentUserAction.shapeType} (${mouseTracker.end.x}, ${mouseTracker.end.y})`;
}
