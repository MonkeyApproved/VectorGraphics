import { BaseSyntheticEvent } from 'react';
import { Coordinate } from 'src/redux/types';

export interface BaseEvent {
  type: string;
}

export interface BaseMouseEvent extends BaseEvent {
  target: string;
  start: Coordinate;
}

export const MOUSE_IDLE_EVENT_TYPE = 'idle';
export interface Idle extends BaseEvent {
  type: typeof MOUSE_IDLE_EVENT_TYPE;
}

export const MOUSE_DOWN_EVENT_TYPE = 'mouseDown';
export interface MouseDown extends BaseMouseEvent {
  type: typeof MOUSE_DOWN_EVENT_TYPE;
}

export const MOUSE_MOVE_ACTIVE_EVENT_TYPE = 'mouseMoveActive';
export interface MouseDragActive extends BaseMouseEvent {
  type: typeof MOUSE_MOVE_ACTIVE_EVENT_TYPE;
  current: Coordinate;
}

export const MOUSE_MOVE_FINISHED_EVENT_TYPE = 'mouseMoveFinished';
export interface MouseDragFinished extends BaseMouseEvent {
  type: typeof MOUSE_MOVE_FINISHED_EVENT_TYPE;
  end: Coordinate;
}

export const MOUSE_CLICK_EVENT_TYPE = 'mouseClick';
export interface MouseClick extends BaseMouseEvent {
  type: typeof MOUSE_CLICK_EVENT_TYPE;
}

export type MouseEventTracker = Idle | MouseDown | MouseDragActive | MouseDragFinished | MouseClick;

/**
 * Canvas mouse event based on BaseSyntheticEvent.
 *
 * The original BaseSyntheticEvent has three generics:
 *   - E (event): the type of the event (e.g. MouseEvent),
 *   - C (currentTarget): a reference to the element on which the event listener is registered,
 *   - T (target): a reference to the element from which the event was originally dispatched.
 *     This might be a child element to the element on which the event listener is registered.
 */
export type CanvasMouseEvent = BaseSyntheticEvent<MouseEvent, SVGSVGElement>;
