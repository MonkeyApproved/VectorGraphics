import { XCoordinate, YCoordinate } from '../types';
import { PathSegment } from './pathUtils/segmentTypes';
import { shapeToPath } from './pathUtils/shapeToPath';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

export interface Path extends BaseShape {
  type: 'path';
  segments: PathSegment[];
  closed: boolean;
}

export const getPathParams: GetSvgParams<Path> = ({ shape }) => {
  return {
    d: shapeToPath({ shape }),
  };
};

export const getNewPath: GetNewShape<Path> = ({ start }) => {
  return {
    type: 'path',
    segments: [{ type: 'move', endPoint: start }],
    closed: false,
  };
};

export const getPathArea: GetShapeArea<Path> = ({ shape }) => {
  const xList: XCoordinate[] = shape.segments.map(({ endPoint }) => endPoint.x);
  const minX = Math.min(...xList);
  const maxX = Math.max(...xList);
  const yList: YCoordinate[] = shape.segments.map(({ endPoint }) => endPoint.y);
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
