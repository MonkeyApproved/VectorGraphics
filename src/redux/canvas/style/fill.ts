import { line } from 'd3';
import { Percentage } from '../types';
import { Color } from './color';

export const defaultFillStyle: Fill = {
  color: 'black',
  opacity: 1,
};

export interface Fill {
  color?: Color;
  opacity?: Percentage;
  rule?: 'nonzero' | 'evenodd';
}
