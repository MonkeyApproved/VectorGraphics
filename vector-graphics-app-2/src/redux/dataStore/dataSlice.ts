import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasMouseEvent, mouseReducers } from './handlers/mouseHandlers';

import { ElementDict } from './svg/elementDict';
import { svgReducers } from './svg/reducers';

export interface SvgState {
  elementDict: ElementDict;
  canvasId: string | undefined;
  selectedElementId: string | undefined;
}

const initialSvgState: SvgState = {
  elementDict: {},
  canvasId: undefined,
  selectedElementId: undefined,
};

const initialMouseEventState: CanvasMouseEvent = {
  status: 'idle',
  targetId: '',
};

export interface DataState {
  svg: SvgState;
  mouseEvent: CanvasMouseEvent;
  equations: string;
}

const initialState: DataState = {
  svg: initialSvgState,
  mouseEvent: initialMouseEventState,
  equations: 'TBD',
};

export type DataSliceReducer<PayloadType> = (state: DataState, { payload, type }: PayloadAction<PayloadType>) => void;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: { ...svgReducers, ...mouseReducers },
});

export default dataSlice;
export const {
  setCanvasId,
  addElement,
  updateElementPosition,
  updateElementSize,
  updateElementStroke,
  deleteElement,
  selectSingleElement,
  mouseDown,
  mouseDrag,
  mouseUp,
} = dataSlice.actions;
