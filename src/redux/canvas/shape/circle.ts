import { getAreaCenter, getAreaContainingCoordinates } from '../coordinateMath';
import { Coordinate, Length } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

export interface Circle extends BaseShape {
  type: 'circle';
  center: Coordinate;
  radius: Length;
}

export const getCircleParams: GetSvgParams<Circle> = ({ shape }) => {
  return {
    cx: shape.center.x,
    cy: shape.center.y,
    r: shape.radius,
  };
};

export const getNewCircle: GetNewShape<Circle> = ({ start, end }) => {
  const area = getAreaContainingCoordinates({ coordinateList: [start, end] });
  return {
    type: 'circle',
    center: getAreaCenter({ area }),
    radius: Math.min(area.size.width, area.size.height) / 2,
  };
};

export const getCircleArea: GetShapeArea<Circle> = ({ shape }) => {
  const x1 = shape.center.x + shape.radius;
  const x2 = shape.center.x - shape.radius;
  const y1 = shape.center.y + shape.radius;
  const y2 = shape.center.y - shape.radius;
  return {
    minX: Math.min(x1, x2),
    centerX: (x1 + x2) / 2,
    maxX: Math.max(x1, x2),
    minY: Math.min(y1, y2),
    centerY: (y1 + y2) / 2,
    maxY: Math.max(y1, y2),
  };
};
