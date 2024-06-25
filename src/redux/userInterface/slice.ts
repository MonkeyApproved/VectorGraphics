import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tabs } from './types';
import { reducers } from './reducers';
import { CANVAS_CONTENT_TYPE, VARIABLE_MANAGER_CONTENT_TYPE } from 'src/redux/content';
import { initialCanvas, initialVariableManager } from 'src/redux/utils';

export interface UiState {
  tabCounter: number;
  tabs: Tabs;
}

export const initialUserInterfaceState: UiState = {
  tabCounter: 2,
  tabs: {
    type: 'twoHorizontal',
    content: {
      left: [
        {
          type: CANVAS_CONTENT_TYPE,
          contentId: initialCanvas.id,
          tabId: 'tab1',
          position: { horizontal: 'left', vertical: 'top' },
        },
      ],
      right: [
        {
          type: VARIABLE_MANAGER_CONTENT_TYPE,
          contentId: initialVariableManager.id,
          tabId: 'tab2',
          position: { horizontal: 'right', vertical: 'top' },
        },
      ],
    },
  },
};

export type UiSliceReducer<PayloadType> = (state: UiState, { payload, type }: PayloadAction<PayloadType>) => void;

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUserInterfaceState,
  reducers: { ...reducers },
});
export default uiSlice;
export const { addNewTab, removeTab, moveTab, changeTabAreaType } = uiSlice.actions;
