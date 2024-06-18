import { Coordinate, Offset } from '../types';
import { BaseTransformation } from './transformation';

export interface Skew extends BaseTransformation {
  type: 'skew';
  direction: keyof Coordinate;
  factor: number;
}
