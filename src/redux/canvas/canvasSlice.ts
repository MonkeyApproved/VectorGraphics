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
import { getFreshStats } from './utils';

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

export const initialCanvasState: CanvasState = {
  globalSettings: defaultSvgSettings,
  counters: initialCounterState,
  shapes: {},
  styles: {},
  transformations: {},
  elements: {},
  groups: {},
  canvases: {
    canvas1: {
      id: 'canvas1',
      stats: getFreshStats(),
      label: 'Canvas',
      viewBox: '0 0 100 100',
      elementIds: [],
    },
  },
};

export type CanvasSliceReducer<PayloadType> = (
  state: CanvasState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const canvasSlice = createSlice({
  name: 'canvas',
  initialState: initialCanvasState,
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
