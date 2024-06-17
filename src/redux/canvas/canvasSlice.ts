import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { defaultSvgSettings, SvgSettings } from './settings';

export interface Canvas {
  id: string;
  name: string;
  viewBox: string;
  elements: string[];
  localSettings: SvgSettings;
}

export interface CanvasState {
  globalSettings: SvgSettings;
  shapes: string[];
  styles: string[];
  canvases: Canvas[];
}

export const initialState: CanvasState = {
  globalSettings: defaultSvgSettings,
  shapes: [],
  styles: [],
  canvases: [],
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
