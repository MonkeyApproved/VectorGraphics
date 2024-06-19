import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentCounter, initialCounterState } from './id';
import { defaultSvgSettings, SvgSettings } from './settings';
import { Shape } from './shape';
import { Style } from './style';
import { Transformation } from './transformation';
import { Element } from './element';
import { Group } from './group';
import { Canvas } from './canvas';
import { reducers } from './reducers';

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
export const {
  // canvas reducers
  addCanvas,
  removeCanvas,
  addElementToCanvas,
  // element/shape reducers
  addElement,
  duplicateElement,
  removeElement,
  updateShape,
  // style reducers
  applyNewStyle,
  applyExistingStyle,
  updateStyle,
} = canvasSlice.actions;
