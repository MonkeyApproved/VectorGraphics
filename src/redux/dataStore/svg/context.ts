import { BaseContext } from '../../math';
import { Coordinate } from './coordinate';

export interface SvgBaseContext extends BaseContext {
  type: 'svg';
  usage: string;
  dimension: string;
}

export interface SvgCoordinateContext extends SvgBaseContext {
  usage: 'position' | 'size' | 'scale' | 'skew' | 'translate';
  dimension: keyof Coordinate;
}

export interface SvgRotationContext extends SvgBaseContext {
  usage: 'rotate';
  dimension: keyof Coordinate | 'angle';
}

export interface SvgStrokeContext extends SvgBaseContext {
  usage: 'stroke';
  dimension: 'width' | 'opacity' | 'miterLimit' | 'color' | 'dashArray' | 'dashOffset';
}

export interface SvgFillContext extends SvgBaseContext {
  usage: 'fill';
  dimension: 'color' | 'opacity';
}

export type SvgContext = SvgCoordinateContext | SvgRotationContext | SvgStrokeContext | SvgFillContext;
