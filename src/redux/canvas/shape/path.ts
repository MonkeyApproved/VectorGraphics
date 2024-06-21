import { PathSegment } from './pathUtils/segmentTypes';
import { shapeToPath } from './pathUtils/shapeToPath';
import { BaseShape, GetNewShape, GetSvgParams } from './shape';

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
