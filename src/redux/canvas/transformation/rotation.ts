import { Angle, Coordinate } from '../types';
import { BaseTransformation } from './transformation';

export interface Rotation extends BaseTransformation {
  type: 'rotate';
  angle: Angle;
  center: Coordinate;
}
