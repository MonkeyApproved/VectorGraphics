import { Stats } from '../types';

export interface Element {
  id: string;
  stats: Stats;
  shapeId: string;
  styleId?: string;
  transformationId?: string;
}
