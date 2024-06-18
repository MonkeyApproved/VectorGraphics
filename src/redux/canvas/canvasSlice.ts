import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { defaultSvgSettings, SvgSettings } from './settings';
import { Shape } from './shape';
import { Style } from './style';
import { Transformation } from './transformation';
import { Element } from './element';
import { Group } from './group';
import { ComponentCounter, initialCounterState } from './id';

export interface Canvas {
  id: string;
  name: string;
  viewBox: string;
  elementIds: string[]; // can be elements or groups
  localSettings: SvgSettings;
}

export interface CanvasState {
  globalSettings: SvgSettings;
  counters: ComponentCounter;
  shapes: { [key: string]: Shape };
  styles: { [key: string]: Style };
  transformations: { [key: string]: Transformation };
  elements: { [key: string]: Element };
  groups: { [key: string]: Group };
  canvases: { [key: string]: Canvas };
}

export const initialState: CanvasState = {
  globalSettings: defaultSvgSettings,
  counters: initialCounterState,
  shapes: {},
  styles: {},
  transformations: {},
  elements: {},
  groups: {},
  canvases: {},
};

export type CanvasSliceReducer<PayloadType> = (
  state: CanvasState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: { ...reducers },
});
export default canvasSlice;
export const {} = canvasSlice.actions;
