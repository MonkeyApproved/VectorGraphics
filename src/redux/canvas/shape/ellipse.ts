import { getAreaCenter, getAreaContainingCoordinates } from '../coordinateMath';
import { Coordinate, Length } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

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

export const getNewEllipse: GetNewShape<Ellipse> = ({ start, end }) => {
  const area = getAreaContainingCoordinates({ coordinateList: [start, end] });
  return {
    type: 'ellipse',
    center: getAreaCenter({ area }),
    radiusX: area.size.width / 2,
    radiusY: area.size.height / 2,
  };
};

export const getEllipseArea: GetShapeArea<Ellipse> = ({ shape }) => {
  const x1 = shape.center.x + shape.radiusX;
  const x2 = shape.center.x - shape.radiusX;
  const y1 = shape.center.y + shape.radiusY;
  const y2 = shape.center.y - shape.radiusY;
  return {
    minX: Math.min(x1, x2),
    centerX: (x1 + x2) / 2,
    maxX: Math.max(x1, x2),
    minY: Math.min(y1, y2),
    centerY: (y1 + y2) / 2,
    maxY: Math.max(y1, y2),
  };
};
