import { Length, LengthArray, LineWidth, Percentage } from '../types';
import { Color } from './color';

export const defaultStrokeStyle: Stroke = {
  color: 'black',
  opacity: 1,
  width: 1,
};

export interface Stroke {
  color?: Color;
  opacity?: Percentage;
  width?: LineWidth;
  lineJoin?: 'miter' | 'round' | 'bevel'; // style of line connections (pointy, round or squared-off)
  miterLimit?: Length; // in case of lineJoin: "miter", this defines at which point we switch to squared-off
  lineCap?: 'butt' | 'round' | 'square'; // line endings
  dashArray?: LengthArray;
  dashOffset?: Length;
}
