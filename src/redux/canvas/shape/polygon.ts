import { Coordinate } from '../types';
import { BaseShape, GetNewShape, GetSvgParams } from './shape';

export interface Polygon extends BaseShape {
  type: 'polygon';
  points: Coordinate[];
}

export const getPolygonParams: GetSvgParams<Polygon> = ({ shape }) => {
  return {
    points: shape.points.map(({ x, y }) => `${x},${y}`).join(' '),
  };
};

export const getNewPolygon: GetNewShape<Polygon> = ({ start, end }) => {
  return {
    type: 'polygon',
    points: [start, end],
  };
};
