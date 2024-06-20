import { getAreaCenter, getAreaContainingCoordinates } from '../coordinateMath';
import { Coordinate, Length } from '../types';
import { BaseShape, GetNewShape, GetSvgParams } from './shape';

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
