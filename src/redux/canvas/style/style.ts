import { BaseEntity } from '../types';
import { Fill } from './fill';
import { Stroke } from './stroke';

export interface Style extends BaseEntity {
  fill?: Fill;
  stroke?: Stroke;
}
