import { Coordinate, DrawAction, ShapeType } from 'src/redux/types';
import { Dispatch, RefObject, SetStateAction } from 'react';
import DrawPointShape from './DrawPointShape';
import DrawSimpleShape from './DrawSimpleShape';

export const pointShapeTypes: ShapeType[] = ['polygon', 'polyline', 'path'];

export interface DrawShapeProps {
  canvasId: string;
  currentUserAction: DrawAction;
  canvasRef: RefObject<SVGSVGElement>;
  shapeType: ShapeType;
  mouseDownPosition: Coordinate;
  setMouseActionActive: Dispatch<SetStateAction<boolean>>;
}

export default function DrawShape(props: DrawShapeProps) {
  if (pointShapeTypes.includes(props.currentUserAction.shapeType)) {
    return <DrawPointShape {...props} />;
  }
  return <DrawSimpleShape {...props} />;
}
