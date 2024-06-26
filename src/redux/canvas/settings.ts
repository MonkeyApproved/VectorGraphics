import { Style } from './style';
import { getFreshStats } from './utils';

export type SvgTool = 'select' | 'addLine' | 'addRect' | 'addEllipse';

export interface SvgSettings {
  activeTool: SvgTool;
  defaultElementStyle: Style;
  selectionBoxStyle: Style;
}

export const defaultSvgSettings: SvgSettings = {
  activeTool: 'select',
  defaultElementStyle: {
    id: 'canvasElementDefault',
    stats: getFreshStats(),
    stroke: { color: 'white', width: 2 },
    fill: { color: '#666666', opacity: 0.5 },
  },
  selectionBoxStyle: {
    id: 'canvasSelectionDefault',
    stats: getFreshStats(),
    stroke: { color: '#55BBEE', width: 0.2 },
    fill: { color: '#55bbEE', opacity: 0.2 },
  },
};
