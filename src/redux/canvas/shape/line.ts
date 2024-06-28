import { Coordinate } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

export interface Line extends BaseShape {
  type: 'line';
  start: Coordinate;
  end: Coordinate;
}

export const getLineParams: GetSvgParams<Line> = ({ shape }) => {
  return {
    x1: shape.start.x,
    y1: shape.start.y,
    x2: shape.end.x,
    y2: shape.end.y,
  };
};

export const getNewLine: GetNewShape<Line> = ({ start, end }) => {
  return {
    type: 'line',
    start,
    end,
  };
};

export const getLineArea: GetShapeArea<Line> = ({ shape }) => {
  const x1 = shape.start.x;
  const x2 = shape.end.x;
  const y1 = shape.start.y;
  const y2 = shape.end.y;
  return {
    minX: Math.min(x1, x2),
    centerX: (x1 + x2) / 2,
    maxX: Math.max(x1, x2),
    minY: Math.min(y1, y2),
    centerY: (y1 + y2) / 2,
    maxY: Math.max(y1, y2),
  };
};
