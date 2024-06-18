import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { defaultSvgSettings, SvgSettings } from './settings';
import { Shape } from './shape/shape';
import { Style } from './style/style';

export interface Canvas {
  id: string;
  name: string;
  viewBox: string;
  elements: Element[];
  localSettings: SvgSettings;
}

export interface CanvasState {
  globalSettings: SvgSettings;
  shapes: { [key: string]: Shape };
  styles: { [key: string]: Style };
  canvases: { [key: string]: Canvas };
}

export const initialState: CanvasState = {
  globalSettings: defaultSvgSettings,
  shapes: {},
  styles: {},
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
