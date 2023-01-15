import { ElementDict } from './elementDict';
import { defaultSvgSettings, SvgSettings } from './settings';

export interface SvgState {
  elementDict: ElementDict;
  settings: SvgSettings;
  canvasId: string | undefined;
  bottomCanvasId: string | undefined;
  selectedElementIds: string[];
}

export const initialSvgState: SvgState = {
  elementDict: {},
  settings: defaultSvgSettings,
  canvasId: undefined,
  bottomCanvasId: undefined,
  selectedElementIds: [],
};
