import * as d3 from 'd3';
import { BaseSyntheticEvent } from 'react';
import { BaseElement, BaseElementFunction } from './element';

export interface Coordinate {
  x: number;
  y: number;
}

export type Position = Coordinate;
export type Size = Coordinate;

export interface CoordinateMathProps {
  leftArg: Coordinate;
  rightArg: Coordinate;
}

export function addCoordinates({ leftArg, rightArg }: CoordinateMathProps): Coordinate {
  return { x: leftArg.x + rightArg.x, y: leftArg.y + rightArg.y };
}

export function subtractCoordinates({ leftArg, rightArg }: CoordinateMathProps): Coordinate {
  return { x: leftArg.x - rightArg.x, y: leftArg.y - rightArg.y };
}

export interface UpdatePositionProps {
  element: BaseElement;
  x?: number;
  y?: number;
}

export function updatePosition({ element, x, y }: UpdatePositionProps): BaseElement {
  const oldCoordinate: Coordinate = element.position;
  const newCoordinate: Coordinate = { x: x || oldCoordinate.x, y: y || oldCoordinate.y };
  return { ...element, position: newCoordinate };
}

export function applyPosition({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection) {
    return element;
  }
  if (element.type === 'rect') {
    elementSelection.attr('x', element.position.x).attr('y', element.position.y);
  }
  if (element.type === 'ellipse') {
    elementSelection.attr('cx', element.position.x).attr('cy', element.position.y);
  }
  if (element.type === 'line') {
    const endpoint = addCoordinates({ leftArg: element.position, rightArg: element.size });
    elementSelection.attr('x2', endpoint.x).attr('y2', endpoint.y);
    elementSelection.attr('x1', element.position.x).attr('y1', element.position.y);
  }
  return element;
}

export function applySize({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection) {
    return element;
  }
  if (element.type === 'rect') {
    elementSelection.attr('width', element.size.x).attr('height', element.size.y);
  }
  if (element.type === 'ellipse') {
    elementSelection.attr('rx', element.size.x).attr('ry', element.size.y);
  }
  if (element.type === 'line') {
    const endpoint = addCoordinates({ leftArg: element.position, rightArg: element.size });
    elementSelection.attr('x2', endpoint.x).attr('y2', endpoint.y);
    elementSelection.attr('x1', element.position.x).attr('y1', element.position.y);
  }
  return element;
}

export function getMousePosition({ event }: { event: BaseSyntheticEvent }): Coordinate {
  const position = d3.pointer(event);
  return { x: position[0], y: position[1] };
}

export interface GetPositionAfterDragProps {
  initialElementPosition: Coordinate;
  initialMousePosition: Coordinate;
  currentMousePosition: Coordinate;
}

export function getPositionAfterDrag({
  initialElementPosition,
  initialMousePosition,
  currentMousePosition,
}: GetPositionAfterDragProps): Coordinate {
  const delta = subtractCoordinates({ leftArg: currentMousePosition, rightArg: initialMousePosition });
  return addCoordinates({ leftArg: initialElementPosition, rightArg: delta });
}
