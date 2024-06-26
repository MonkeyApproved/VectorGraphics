import { Shape } from '../shape';
import { Style } from '../style';
import { Transformation } from '../transformation';
import { Stats } from '../types';

export interface Element {
  id: string;
  stats: Stats;
  shapeId: string;
  styleId?: string;
  transformationId?: string;
}

export interface ElementResolved {
  id: string;
  stats: Stats;
  shape: Shape;
  style?: Style;
  transformation?: Transformation;
}
