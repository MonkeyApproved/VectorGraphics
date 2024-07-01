import { Coordinate, ElementDetails, ShapeType } from 'src/redux/types';
import { Dispatch, RefObject, SetStateAction } from 'react';
import DrawPointShape from './DrawPointShape';
import DrawSimpleShape from './DrawSimpleShape';
import { ReactSetState } from '../../types';
import { MouseState } from '..';

export const pointShapeTypes: ShapeType[] = ['polygon', 'polyline', 'path'];

export interface DrawShapeProps {
  canvasId: string;
  shapeType: ShapeType;
  canvasRef: RefObject<SVGSVGElement>;
  selectedElements: string[];
  mouseDownPosition: Coordinate;
  setMouseState: Dispatch<SetStateAction<MouseState>>;
  setElementShownInMenu: ReactSetState<ElementDetails | undefined>;
  setStatus: ReactSetState<string>;
}

/**
 *
 * @param {object} props - Object containing all properties
 * @param {string} props.canvasId - The id of the canvas
 * @param {DrawAction} props.currentUserAction - The current user action selected by the user ()
 * @returns
 */
export default function DrawShape(props: DrawShapeProps) {
  if (pointShapeTypes.includes(props.shapeType)) {
    return <DrawPointShape {...props} />;
  }
  return <DrawSimpleShape {...props} />;
}
