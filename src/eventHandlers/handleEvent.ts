import * as d3 from 'd3';
import { BaseSyntheticEvent } from 'react';
import { Coordinate } from 'src/redux/types';
import {
  CanvasMouseEvent,
  MOUSE_CLICK_EVENT_TYPE,
  MOUSE_DOWN_EVENT_TYPE,
  MOUSE_DRAG_ACTIVE_EVENT_TYPE,
  MOUSE_DRAG_FINISHED_EVENT_TYPE,
  MOUSE_IDLE_EVENT_TYPE,
  MouseEventTracker,
} from './types';

export enum TokenType {
  MouseDown = 'mousedown',
  MouseMove = 'mousemove',
  MouseUp = 'mouseup',
  MouseLeave = 'mouseleave',
}

export function getMousePosition({ event }: { event: BaseSyntheticEvent }): Coordinate {
  const position = d3.pointer(event);
  return { x: position[0], y: position[1] };
}

interface MouseEventHandlerProps {
  eventTracker: MouseEventTracker;
  currentEvent: CanvasMouseEvent;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateMouseEvent({ eventTracker, currentEvent }: MouseEventHandlerProps): MouseEventTracker {
  const eventType = currentEvent.type;
  if (eventTracker.type === MOUSE_IDLE_EVENT_TYPE && eventType !== TokenType.MouseDown) {
    // there is nothing to do
    return eventTracker;
  } else if (eventType === TokenType.MouseDown) {
    return handleMouseDown({ eventTracker, currentEvent });
  } else if (eventType === TokenType.MouseMove) {
    return handleMouseMove({ eventTracker, currentEvent });
  } else if (eventType === TokenType.MouseUp || eventType === TokenType.MouseLeave) {
    return handleMouseUp({ eventTracker, currentEvent });
  }
  console.warn(`Invalid event type: ${eventType}`);
  return eventTracker;
}

function handleMouseDown({ eventTracker, currentEvent }: MouseEventHandlerProps): MouseEventTracker {
  if (eventTracker.type !== MOUSE_IDLE_EVENT_TYPE) {
    // it seems like the last event was not finished properly
    console.warn(`Got mouse down while canvas tracker was still ${eventTracker.type}`);
  }
  console.warn(currentEvent.nativeEvent.button);
  currentEvent.preventDefault();
  // start a new mouse event
  return {
    type: MOUSE_DOWN_EVENT_TYPE,
    target: currentEvent.target.id,
    start: getMousePosition({ event: currentEvent }),
    eventSteam: eventTracker.type !== MOUSE_IDLE_EVENT_TYPE ? eventTracker.eventSteam : [],
  };
}

function handleMouseMove({ eventTracker, currentEvent }: MouseEventHandlerProps): MouseEventTracker {
  if (eventTracker.type === 'mouseDown' || eventTracker.type === MOUSE_DRAG_ACTIVE_EVENT_TYPE) {
    // this is the first time the mouse moves after a mouse down
    return {
      type: MOUSE_DRAG_ACTIVE_EVENT_TYPE,
      target: eventTracker.target,
      start: eventTracker.start,
      current: getMousePosition({ event: currentEvent }),
      eventSteam: eventTracker.eventSteam,
    };
  }
  return eventTracker;
}

function handleMouseUp({ eventTracker, currentEvent }: MouseEventHandlerProps): MouseEventTracker {
  if (eventTracker.type === MOUSE_DRAG_ACTIVE_EVENT_TYPE) {
    // this is the first time the mouse moves after a mouse down
    const end = getMousePosition({ event: currentEvent });
    return {
      type: MOUSE_DRAG_FINISHED_EVENT_TYPE,
      target: eventTracker.target,
      start: eventTracker.start,
      end,
      eventSteam: [...eventTracker.eventSteam, { position: end, time: Date.now() }],
    };
  } else if (eventTracker.type === MOUSE_DOWN_EVENT_TYPE) {
    // this is the first time the mouse moves after a mouse down
    return {
      type: MOUSE_CLICK_EVENT_TYPE,
      target: eventTracker.target,
      start: eventTracker.start,
      eventSteam: [...eventTracker.eventSteam, { position: eventTracker.start, time: Date.now() }],
    };
  }
  // it seems like the last event was not finished properly
  console.warn(`Got mouse move while canvas tracker was still ${eventTracker.type}`);
  return eventTracker;
}
