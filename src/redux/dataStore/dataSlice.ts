import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquationDict } from './equations/equation';
import { equationReducers } from './equations/reducers';
import { CanvasMouseEvent, mouseReducers } from './handlers/mouseHandlers';
import { svgReducers } from './svg/reducers';
import { initialSvgState, SvgState } from './svg/svgSlice';
import { initialUiState, UiState } from './userInterface/uiSlice';
import { uiReducers } from './userInterface/reducers';

const initialMouseEventState: CanvasMouseEvent = {
  status: 'idle',
  targetId: '',
};

export interface DataState {
  svg: SvgState;
  mouseEvent: CanvasMouseEvent;
  equations: EquationDict;
  userInterface: UiState;
}

const initialState: DataState = {
  svg: initialSvgState,
  mouseEvent: initialMouseEventState,
  equations: {},
  userInterface: initialUiState,
};

export type DataSliceReducer<PayloadType> = (state: DataState, { payload, type }: PayloadAction<PayloadType>) => void;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: { ...svgReducers, ...mouseReducers, ...equationReducers, ...uiReducers },
});

export default dataSlice;
export const {
  // svg reducers
  setCanvasId,
  setBottomCanvasId,
  setActiveTool,
  addElement,
  addPath,
  updateElementProperty,
  updateElementStroke,
  deleteElement,
  selectSingleElement,
  // mouse reducers
  mouseDown,
  mouseDrag,
  mouseUp,
  // equation reducers
  submitEquation,
  renameEquation,
  // ui reducers
  addVariable,
  addNewContentToTabs,
  removeContentFromTabs,
  selectTab,
} = dataSlice.actions;
