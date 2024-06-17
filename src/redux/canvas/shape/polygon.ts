import { Coordinate } from '../types';
import { BaseShape, GetSvgParams } from './shape';

export interface Polygon extends BaseShape {
  type: 'polygon';
  points: Coordinate[];
}

export const getPolygonParams: GetSvgParams<Polygon> = ({ shape }) => {
  return {
    points: shape.points.map(({ x, y }) => `${x},${y}`).join(' '),
  };
};
