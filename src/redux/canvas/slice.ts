import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentCounter, initialCounterState } from './id';
import { defaultSvgSettings, SvgSettings } from './settings';
import { Shape } from './shape';
import { defaultStyle, Style } from './style';
import { Transformation } from './transformation';
import { Element } from './element';
import { Group } from './group';
import { Canvas, getEmptyCanvas } from './canvas';
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

export const initialCanvas: Canvas = { id: 'canvas1', ...getEmptyCanvas({ label: 'Canvas' }) };

export const initialCanvasState: CanvasState = {
  globalSettings: defaultSvgSettings,
  counters: initialCounterState,
  shapes: {},
  styles: {
    [defaultStyle.id]: defaultStyle,
  },
  transformations: {},
  elements: {},
  groups: {},
  canvases: {
    canvas1: initialCanvas,
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
  setUserAction,
  addElementToCanvas,
  // selection reducers
  setSelectedElements,
  // element/shape reducers
  duplicateElement,
  removeElement,
  updateShape,
  updateShapeFromVariableNamespace,
  // style reducers
  applyNewStyle,
  applyExistingStyle,
  updateStyle,
} = canvasSlice.actions;
