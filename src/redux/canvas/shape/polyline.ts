import { Coordinate } from '../types';
import { BaseShape, GetNewShape, GetSvgParams } from './shape';

export interface Polyline extends BaseShape {
  type: 'polyline';
  points: Coordinate[];
}

export const getPolylineParams: GetSvgParams<Polyline> = ({ shape }) => {
  return {
    points: shape.points.map(({ x, y }) => `${x},${y}`).join(' '),
  };
};

export const getNewPolyline: GetNewShape<Polyline> = ({ start }) => {
  return {
    type: 'polyline',
    points: [start],
  };
};
