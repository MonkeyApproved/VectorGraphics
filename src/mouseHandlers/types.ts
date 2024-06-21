import { Coordinate } from 'src/redux/types';

interface BaseEvent {
  type: string;
}

interface BaseMouseEvent extends BaseEvent {
  target: string;
  start: Coordinate;
}

export interface Idle extends BaseEvent {
  type: 'idle';
}

export interface MouseDown extends BaseMouseEvent {
  type: 'mouseDown';
}

export interface MouseDragActive extends BaseMouseEvent {
  type: 'mouseMoveActive';
  current: Coordinate;
}

export interface MouseDragFinished extends BaseMouseEvent {
  type: 'mouseMoveFinished';
  end: Coordinate;
}

export interface MouseClick extends BaseMouseEvent {
  type: 'mouseClick';
}

export type MouseEventTracker = Idle | MouseDown | MouseDragActive | MouseDragFinished | MouseClick;
