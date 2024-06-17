import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  userInterface: UiState;
}

const initialState: DataState = {
  svg: initialSvgState,
  mouseEvent: initialMouseEventState,
  userInterface: initialUiState,
};

export type DataSliceReducer<PayloadType> = (state: DataState, { payload, type }: PayloadAction<PayloadType>) => void;

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: { ...svgReducers, ...mouseReducers, ...uiReducers },
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
  // ui reducers
  addVariable,
  renameVariable,
  removeVariableFromTable,
  addNewContentToTabs,
  removeContentFromTabs,
  selectTab,
} = dataSlice.actions;
