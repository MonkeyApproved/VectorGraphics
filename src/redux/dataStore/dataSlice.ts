import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquationDict } from './equations/equation';
import { equationReducers } from './equations/reducers';
import { CanvasMouseEvent, mouseReducers } from './handlers/mouseHandlers';
import { svgReducers } from './svg/reducers';
import { initialSvgState, SvgState } from './svg/svgSlice';

const initialMouseEventState: CanvasMouseEvent = {
  status: 'idle',
  targetId: '',
};

export interface DataState {
  svg: SvgState;
  mouseEvent: CanvasMouseEvent;
  equations: EquationDict;
}

const initialState: DataState = {
  svg: initialSvgState,
  mouseEvent: initialMouseEventState,
  equations: {},
};

export type DataSliceReducer<PayloadType> = (state: DataState, { payload, type }: PayloadAction<PayloadType>) => void;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: { ...svgReducers, ...mouseReducers, ...equationReducers },
});

export default dataSlice;
export const {
  setCanvasId,
  setBottomCanvasId,
  setActiveTool,
  addElement,
  addPath,
  updateElementProperty,
  updateElementStroke,
  deleteElement,
  selectSingleElement,
  mouseDown,
  mouseDrag,
  mouseUp,
  submitEquation,
  renameEquation,
} = dataSlice.actions;
