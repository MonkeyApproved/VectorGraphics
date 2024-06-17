import { Coordinate, Length } from '../types';
import { BaseShape, GetSvgParams } from './shape';

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
