import { Coordinate } from '../types';
import { BaseShape, GetSvgParams } from './shape';

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
