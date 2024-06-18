import { Scale as ScaleType } from '../types';
import { BaseTransformation } from './transformation';

export interface Scale extends BaseTransformation {
  type: 'translate';
  scale: ScaleType;
}
