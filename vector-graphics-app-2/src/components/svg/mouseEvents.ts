import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { applyPosition, Coordinate, subtractCoordinates, updatePosition } from './coordinate';
import { BaseAreaElementType, ElementDict, ElementRef } from './element';
import { ElementHandlers, HandlerFunction, HandlerFunctionProps } from './handlers';

export type MouseStatus = 'idle' | 'mouseDown' | 'mouseDrag' | 'mouseUp';

export interface MouseEvent {
  status: MouseStatus;
  canvas?: ElementRef<SVGSVGElement>;
  target?: BaseAreaElementType;
  initialElementPosition?: Coordinate;
  initialMousePosition?: Coordinate;
  currentMousePosition?: Coordinate;
}

export function getMouseOffset({ mouseEvent }: { mouseEvent: MouseEvent }) {
  const initialMousePosition = mouseEvent.initialMousePosition;
  const currentMousePosition = mouseEvent.currentMousePosition;
  const initialElementPosition = mouseEvent.initialElementPosition;
  if (initialMousePosition && currentMousePosition && initialElementPosition) {
    return subtractCoordinates({ leftArg: currentMousePosition, rightArg: initialMousePosition });
  }
  return undefined;
}

export interface GetMouseHandlerProps {
  elementDictRef: MutableRefObject<ElementDict>;
  mouseEventRef: MutableRefObject<MouseEvent>;
  setMouseEvent: (mouseEvent: MouseEvent) => void;
}

export function getMouseHandlers({
  elementDictRef,
  mouseEventRef,
  setMouseEvent,
}: GetMouseHandlerProps): ElementHandlers {
  const onMouseMove = (event: MouseEvent) => {
    // update mouse event
    const mousePosition = d3.pointer(event);
    const initialMousePosition = mouseEventRef.current.initialMousePosition;
    const currentMousePosition: Coordinate = { x: mousePosition[0], y: mousePosition[1] };
    const position = mouseEventRef.current.initialElementPosition;
    let element = mouseEventRef.current.target;

    if (initialMousePosition && position && element) {
      const offset = subtractCoordinates({ leftArg: currentMousePosition, rightArg: initialMousePosition });
      element = updatePosition({ element, x: position.x + offset.x, y: position.y + offset.y });
      applyPosition({ element });
    }

    setMouseEvent({
      ...mouseEventRef.current,
      target: element,
      status: 'mouseDrag',
      currentMousePosition,
    });
  };

  const onMousedown: HandlerFunction = ({ elementId, event }: HandlerFunctionProps) => {
    // update mouseEvent
    const element = elementDictRef.current[elementId];
    if (element.type === 'group') {
      return;
    }
    const mousePosition = d3.pointer(event);
    const initialMousePosition: Coordinate = { x: mousePosition[0], y: mousePosition[1] };
    setMouseEvent({
      ...mouseEventRef.current,
      status: 'mouseDown',
      target: element,
      initialElementPosition: { ...element.position },
      initialMousePosition,
      currentMousePosition: initialMousePosition,
    });

    // add subsequent event listeners to canvas
    const svgRef = mouseEventRef.current.canvas;
    if (svgRef) {
      // detect mouse movement, indicating drag action
      svgRef.on('mousemove', onMouseMove);

      // detect end of mouse action (leaving canvas ends mouse action)
      svgRef.on('mouseup', onMouseUp);
      svgRef.on('mouseleave', onMouseUp);
    }
  };

  const onMouseUp: HandlerFunction = () => {
    // remove event listener from canvas
    const svgRef = mouseEventRef.current.canvas;
    if (svgRef) {
      svgRef.on('mousemove', null);
      svgRef.on('mouseup', null);
      svgRef.on('mouseleave', null);
    }

    // update mouse event
    setMouseEvent({ ...mouseEventRef.current, status: 'mouseUp' });
  };

  return { mousedown: onMousedown };
}
