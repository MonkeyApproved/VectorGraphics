import { Coordinate, XCoordinate, YCoordinate } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

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

export const getPolylineArea: GetShapeArea<Polyline> = ({ shape }) => {
  const xList: XCoordinate[] = shape.points.map((p: Coordinate) => p.x);
  const minX = Math.min(...xList);
  const maxX = Math.max(...xList);
  const yList: YCoordinate[] = shape.points.map((p: Coordinate) => p.y);
  const minY = Math.min(...yList);
  const maxY = Math.max(...yList);
  return {
    minX,
    centerX: (minX + maxX) / 2,
    maxX,
    minY,
    centerY: (minY + maxY) / 2,
    maxY,
  };
};
