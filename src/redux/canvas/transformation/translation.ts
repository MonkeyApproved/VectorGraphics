import { Offset } from '../types';
import { BaseTransformation } from './transformation';

export interface Translation extends BaseTransformation {
  type: 'translate';
  offset: Offset;
}
