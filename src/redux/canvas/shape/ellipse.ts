import { Coordinate, Length } from '../types';
import { BaseShape, GetSvgParams } from './shape';

export interface Ellipse extends BaseShape {
  type: 'ellipse';
  center: Coordinate;
  radiusX: Length;
  radiusY: Length;
}

export const getEllipseParams: GetSvgParams<Ellipse> = ({ shape }) => {
  return {
    cx: shape.center.x,
    cy: shape.center.y,
    rx: shape.radiusX,
    ry: shape.radiusY,
  };
};
