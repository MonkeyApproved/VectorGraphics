import { Coordinate } from '../types';
import { BaseShape, GetSvgParams } from './shape';

export interface Polyline extends BaseShape {
  type: 'polyline';
  points: Coordinate[];
}

export const getPolylineParams: GetSvgParams<Polyline> = ({ shape }) => {
  return {
    points: shape.points.map(({ x, y }) => `${x},${y}`).join(' '),
  };
};
