import * as d3 from 'd3';
import { Coordinate } from './coordinate';
import { BaseElementType } from './element';
import { Group } from './group';
import { ElementHandlers, HandlerFunction, HandlerFunctionProps } from './handlers';

export type MouseStatus = 'idle' | 'mouseDown' | 'mouseDrag';

export interface MouseEvent {
  status: MouseStatus;
  target: BaseElementType;
  initialPosition: Coordinate;
  currentPosition: Coordinate;
}

export function getInitialMouseEvent({ target }: { target: BaseElementType }): MouseEvent {
  return {
    status: 'idle',
    target,
    initialPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
  };
}

export interface GetMouseHandlerProps {
  baseGroup: Group;
  mouseEvent: MouseEvent;
  setMouseEvent: (mouseEvent: MouseEvent) => void;
}

export function getMouseHandlers({ baseGroup, mouseEvent, setMouseEvent }: GetMouseHandlerProps): ElementHandlers {
  const onMouseMove = (event: MouseEvent) => {
    const mousePosition = d3.pointer(event);
    const currentPosition: Coordinate = { x: mousePosition[0], y: mousePosition[1] };
    setMouseEvent({
      ...mouseEvent,
      status: 'mouseDrag',
      currentPosition,
    });
    console.log(`mouseMove: ${mousePosition}`);
  };

  const onMousedown: HandlerFunction = ({ elementId, event }: HandlerFunctionProps) => {
    const target = baseGroup.elements[elementId];
    if (!target) {
      throw new Error('Unknown element for click event');
    }
    // update mouseEvent
    const mousePosition = d3.pointer(event);
    const initialPosition: Coordinate = { x: mousePosition[0], y: mousePosition[1] };
    setMouseEvent({
      status: 'mouseDown',
      target,
      initialPosition,
      currentPosition: initialPosition,
    });
    console.log(`mouseDown: ${mousePosition}`);

    // add eventListener for mouse movement which would indicate a drag action
    target.ref?.on('mousemove', onMouseMove);
  };

  const onMouseUp: HandlerFunction = () => {
    setMouseEvent({ ...mouseEvent, status: 'idle' });
    console.log(`mouseUp`);
  };

  return { mousedown: onMousedown, mouseup: onMouseUp };
}
