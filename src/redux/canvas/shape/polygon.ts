import { Coordinate, XCoordinate, YCoordinate } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

export interface Polygon extends BaseShape {
  type: 'polygon';
  points: Coordinate[];
}

export const getPolygonParams: GetSvgParams<Polygon> = ({ shape }) => {
  return {
    points: shape.points.map(({ x, y }) => `${x},${y}`).join(' '),
  };
};

export const getNewPolygon: GetNewShape<Polygon> = ({ start }) => {
  return {
    type: 'polygon',
    points: [start],
  };
};

export const getPolygonArea: GetShapeArea<Polygon> = ({ shape }) => {
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
