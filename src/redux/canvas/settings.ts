import { Style } from './style';
import { getFreshStats } from './utils';

export interface SvgSettings {
  defaultElementStyle: string;
  selectionBoxStyle: Style;
}

export const defaultSvgSettings: SvgSettings = {
  defaultElementStyle: 'style1', // add in initial state of store
  selectionBoxStyle: {
    id: 'canvasSelectionDefault',
    stats: getFreshStats(),
    stroke: { color: '#55BBEE', width: 0.2 },
    fill: { color: '#55bbEE', opacity: 0.2 },
  },
};
