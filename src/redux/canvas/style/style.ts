import { BaseEntity } from '../types';
import { getFreshStats } from '../utils';
import { Fill, defaultFillStyle } from './fill';
import { Stroke, defaultStrokeStyle } from './stroke';

export interface Style extends BaseEntity {
  fill?: Fill;
  stroke?: Stroke;
}

export const defaultStyle: Style = {
  id: 'default',
  stats: getFreshStats(),
  fill: defaultFillStyle,
  stroke: defaultStrokeStyle,
};

export function getSvgStyleParams({ style = defaultStyle }: { style?: Style }): {
  [style: string]: number | string | undefined;
} {
  return {
    fill: style.fill?.color,
    fillOpacity: style.fill?.opacity,
    stroke: style.stroke?.color,
    strokeWidth: style.stroke?.width,
    strokeOpacity: style.stroke?.opacity,
    strokeDashoffset: style.stroke?.dashOffset,
  };
}
