import { BaseEntity, Stats } from '../types';
import { Rotation } from './rotation';
import { Scale } from './scale';
import { Skew } from './skew';
import { Translation } from './translation';

export interface BaseTransformation {
  type: string;
}

export interface Transformation extends BaseEntity {
  apply: (Rotation | Translation | Scale | Skew)[];
}
