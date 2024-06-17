import { PathSegment } from './pathUtils/segmentTypes';
import { getPathDefinition } from './pathUtils/shapeToPath';
import { BaseShape, GetSvgParams } from './shape';

export interface Path extends BaseShape {
  type: 'path';
  segments: PathSegment[];
  closed: boolean;
}

export const getPathParams: GetSvgParams<Path> = ({ shape }) => {
  return {
    d: getPathDefinition({ shape }),
  };
};
