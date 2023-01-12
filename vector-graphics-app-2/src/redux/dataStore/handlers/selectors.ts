import { RootState } from 'redux/store';
import { MouseStatus } from './mouseHandlers';

export const getMouseEventStatus = (state: RootState): MouseStatus => state.data.mouseEvent.status;
