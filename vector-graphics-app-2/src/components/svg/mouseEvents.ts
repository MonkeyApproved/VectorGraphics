import * as d3 from 'd3';
import { MutableRefObject } from 'react';
import { Coordinate } from './coordinate';
import { BaseElementType, ElementRef } from './element';
import { ElementHandlers, HandlerFunction, HandlerFunctionProps } from './handlers';

export type MouseStatus = 'idle' | 'mouseDown' | 'mouseDrag';

export interface MouseEvent {
  status: MouseStatus;
  canvas?: ElementRef<SVGSVGElement>;
  target?: BaseElementType;
  initialPosition?: Coordinate;
  currentPosition?: Coordinate;
}

export interface GetMouseHandlerProps {
  mouseEventRef: MutableRefObject<MouseEvent>;
  setMouseEvent: (mouseEvent: MouseEvent) => void;
}

export function getMouseHandlers({ mouseEventRef, setMouseEvent }: GetMouseHandlerProps): ElementHandlers {
  const onMouseMove = (event: MouseEvent) => {
    const mousePosition = d3.pointer(event);
    const currentPosition: Coordinate = { x: mousePosition[0], y: mousePosition[1] };
    setMouseEvent({
      ...mouseEventRef.current,
      status: 'mouseDrag',
      currentPosition,
    });
  };

  const onMousedown: HandlerFunction = ({ element, event }: HandlerFunctionProps) => {
    // update mouseEvent
    const mousePosition = d3.pointer(event);
    const initialPosition: Coordinate = { x: mousePosition[0], y: mousePosition[1] };
    setMouseEvent({
      ...mouseEventRef.current,
      status: 'mouseDown',
      target: element,
      initialPosition,
      currentPosition: initialPosition,
    });

    // add event listener for mouse movement which would indicate a drag action
    const svgRef = mouseEventRef.current.canvas;
    if (svgRef) {
      svgRef.on('mousemove', onMouseMove);
      svgRef.on('mouseup', onMouseUp);
      svgRef.on('mouseleave', onMouseUp);
    }
  };

  const onMouseUp: HandlerFunction = () => {
    // remove event listener from canvas
    const svgRef = mouseEventRef.current.canvas;
    if (svgRef) {
      svgRef.on('mousemove', null);
      svgRef.on('mouseleave', null);
    }

    // mouse event ends, idle until next mouseDown
    setMouseEvent({ ...mouseEventRef.current, status: 'idle' });
  };

  return { mousedown: onMousedown };
}
