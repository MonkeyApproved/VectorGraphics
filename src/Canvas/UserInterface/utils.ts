import * as d3 from 'd3';
import { Coordinate } from 'src/redux/types';
import { ReactMouseEvent } from './types';
import { RefObject } from 'react';

export function getMousePosition({
  event,
  canvas,
}: {
  event: MouseEvent | ReactMouseEvent;
  canvas: RefObject<SVGSVGElement>;
}): Coordinate {
  const position = d3.pointer(event, canvas.current);
  return { x: position[0], y: position[1] };
}
