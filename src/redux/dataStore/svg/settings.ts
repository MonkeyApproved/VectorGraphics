import { FillStyle } from './fill';
import { Stroke } from './stroke';

export type SvgTool = 'select' | 'addLine' | 'addRect' | 'addEllipse';

export interface SvgStyle {
  stroke: Stroke;
  fill: FillStyle;
}

export interface SvgSettings {
  activeTool: SvgTool;
  defaultElementStyle: SvgStyle;
  selectionBoxStyle: SvgStyle;
}

export const defaultSvgSettings: SvgSettings = {
  activeTool: 'select',
  defaultElementStyle: {
    stroke: { color: 'black', width: 1 },
    fill: { color: 'black', opacity: 0.5 },
  },
  selectionBoxStyle: {
    stroke: { color: '#55BBEE', width: 0.2 },
    fill: { color: '#55bbEE', opacity: 0.2 },
  },
};
