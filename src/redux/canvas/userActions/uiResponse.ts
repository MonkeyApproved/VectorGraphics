import { MouseEventTracker } from 'src/mouseHandlers';
import { DRAW_ACTION_TYPE, SELECT_ACTION_TYPE } from '.';
import { Rect, NewShape, TempShareGeneric } from '../shape';

export interface BaseUIResponse {
  type: string;
  statusMessage: string;
  mouseTrackerUpdate?: MouseEventTracker;
  completed?: boolean;
}

export const IDLE_ACTION_TYPE = 'idle';
export interface IdleResponse extends BaseUIResponse {
  type: typeof IDLE_ACTION_TYPE;
}

export interface DrawResponse extends BaseUIResponse {
  type: typeof DRAW_ACTION_TYPE;
  tempShape: NewShape;
}

export interface SelectResponse extends BaseUIResponse {
  type: typeof SELECT_ACTION_TYPE;
  selectionRect: TempShareGeneric<Rect>;
  selectedElementIds: string[];
  completed: boolean;
}

export type UIResponse = IdleResponse | DrawResponse | SelectResponse;
