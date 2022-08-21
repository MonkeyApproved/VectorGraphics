import { BaseAreaElement, BaseAreaElementType } from './element';

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
  return { x: leftArg.x + rightArg.x, y: leftArg.y + leftArg.y };
}

export function subtractCoordinates({ leftArg, rightArg }: CoordinateMathProps): Coordinate {
  return { x: leftArg.x - rightArg.x, y: leftArg.y - leftArg.y };
}

export interface updatePositionProps {
  element: BaseAreaElement;
  x?: number;
  y?: number;
}

export function updatePosition({ element, x, y }: updatePositionProps): BaseAreaElement {
  if (!element.position) {
    return element;
  }
  const oldCoordinate: Coordinate = element.position;
  const newCoordinate: Coordinate = { x: x || oldCoordinate.x, y: y || oldCoordinate.y };
  return { ...element, position: newCoordinate };
}

export function applyPosition({ element }: { element: BaseAreaElementType }): BaseAreaElementType {
  if (!element.ref) {
    return element;
  }
  if (element.type === 'rect') {
    element.ref.attr('x', element.position.x).attr('y', element.position.y);
  }
  if (element.type === 'ellipse') {
    element.ref.attr('cx', element.position.x).attr('cy', element.position.y);
  }
  if (element.type === 'line') {
    element.ref.attr('x1', element.position.x).attr('y1', element.position.y);
  }
  return element;
}

export function applySize({ element }: { element: BaseAreaElementType }): BaseAreaElementType {
  if (!element.ref) {
    return element;
  }
  if (element.type === 'rect') {
    element.ref.attr('width', element.size.x).attr('height', element.size.y);
  }
  if (element.type === 'ellipse') {
    element.ref.attr('rx', element.size.x).attr('ry', element.size.y);
  }
  if (element.type === 'line') {
    const endpoint = addCoordinates({ leftArg: element.position, rightArg: element.size });
    element.ref.attr('x2', endpoint.x).attr('y2', endpoint.y);
  }
  return element;
}
