import * as d3 from 'd3';
import { BaseSyntheticEvent } from 'react';
import { Coordinate } from 'src/redux/types';
import { CanvasMouseEvent, MouseEventTracker } from './types';

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
  if (eventTracker.type === 'idle' && eventType !== TokenType.MouseDown) {
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
  if (eventTracker.type !== 'idle') {
    // it seems like the last event was not finished properly
    console.warn(`Got mouse down while canvas tracker was still ${eventTracker.type}`);
  }
  console.warn(currentEvent.nativeEvent.button);
  currentEvent.preventDefault();
  // start a new mouse event
  return {
    type: 'mouseDown',
    target: currentEvent.target.id,
    start: getMousePosition({ event: currentEvent }),
  };
}

function handleMouseMove({ eventTracker, currentEvent }: MouseEventHandlerProps): MouseEventTracker {
  if (eventTracker.type === 'mouseDown' || eventTracker.type === 'mouseMoveActive') {
    // this is the first time the mouse moves after a mouse down
    return {
      type: 'mouseMoveActive',
      target: eventTracker.target,
      start: eventTracker.start,
      current: getMousePosition({ event: currentEvent }),
    };
  }
  return eventTracker;
}

function handleMouseUp({ eventTracker, currentEvent }: MouseEventHandlerProps): MouseEventTracker {
  if (eventTracker.type === 'mouseMoveActive') {
    // this is the first time the mouse moves after a mouse down
    return {
      type: 'mouseMoveFinished',
      target: eventTracker.target,
      start: eventTracker.start,
      end: getMousePosition({ event: currentEvent }),
    };
  } else if (eventTracker.type === 'mouseDown') {
    // this is the first time the mouse moves after a mouse down
    return {
      type: 'mouseClick',
      target: eventTracker.target,
      start: eventTracker.start,
    };
  }
  // it seems like the last event was not finished properly
  console.warn(`Got mouse move while canvas tracker was still ${eventTracker.type}`);
  return eventTracker;
}
