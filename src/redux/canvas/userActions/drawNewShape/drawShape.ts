import { BaseEvent, MouseEventTracker } from 'src/eventHandlers';
import { Canvas } from '../../canvas';
import { DrawAction } from '../userAction';
import { UIResponse } from '../uiResponse';
import { ShapeType } from '../../shape';
import drawPointShape from './drawPointShape';
import drawSimpleShape from './drawSimpleShape';

export interface DrawShapeProps<T extends BaseEvent> {
  mouseTracker: T;
  canvas: Canvas<DrawAction>;
}

export const pointShapeList: ShapeType[] = ['polygon', 'polyline', 'path'];

export default function drawNewShape({ canvas, mouseTracker }: DrawShapeProps<MouseEventTracker>): UIResponse {
  const shapeType = canvas.currentUserAction.shapeType;
  if (pointShapeList.includes(shapeType)) {
    return drawPointShape({ canvas, mouseTracker });
  }
  return drawSimpleShape({ canvas, mouseTracker });
}
