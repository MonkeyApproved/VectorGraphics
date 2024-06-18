import { BaseEntity } from '../types';

export interface Group extends BaseEntity {
  elementIds: string[];
  styleId?: string;
  transformationId?: string;
}
