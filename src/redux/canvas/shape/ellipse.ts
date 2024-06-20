import { getAreaCenter, getAreaContainingCoordinates } from '../coordinateMath';
import { Coordinate, Length } from '../types';
import { BaseShape, GetNewShape, GetSvgParams } from './shape';

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
