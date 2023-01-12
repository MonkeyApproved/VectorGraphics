import * as d3 from 'd3';
import { BaseSyntheticEvent } from 'react';
import { DataState } from '../dataSlice';
import { updateEquationInput } from '../equations/computeResult';
import { getCoordinate } from '../equations/equation';
import { BaseElement, BaseElementFunction } from './element';

export interface Coordinate {
  x: number;
  y: number;
}

export interface CoordinateEquations {
  x: string;
  y: string;
}

export type Position = CoordinateEquations;
export type Size = CoordinateEquations;

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

export interface SetCoordinateProps {
  element: BaseElement;
  x: string | number;
  y: string | number;
  state: DataState;
}

export function setPosition({ element, x, y, state }: SetCoordinateProps) {
  updateEquationInput({ equationId: element.position.x, value: x, state });
  updateEquationInput({ equationId: element.position.y, value: y, state });
}

export function setSize({ element, x, y, state }: SetCoordinateProps) {
  updateEquationInput({ equationId: element.size.x, value: x, state });
  updateEquationInput({ equationId: element.size.y, value: y, state });
}

export function applyPosition({ element, elementSelection, state }: BaseElementFunction): BaseElement {
  const position = getCoordinate({ coordinateEquations: element.position, state });
  if (element.type === 'rect') {
    elementSelection.attr('x', position.x).attr('y', position.y);
  }
  if (element.type === 'ellipse') {
    elementSelection.attr('cx', position.x).attr('cy', position.y);
  }
  if (element.type === 'line') {
    const size = getCoordinate({ coordinateEquations: element.size, state });
    const endpoint = addCoordinates({ leftArg: position, rightArg: size });
    elementSelection.attr('x2', endpoint.x).attr('y2', endpoint.y);
    elementSelection.attr('x1', position.x).attr('y1', position.y);
  }
  return element;
}

export function applySize({ element, elementSelection, state }: BaseElementFunction): BaseElement {
  const size = getCoordinate({ coordinateEquations: element.size, state });
  if (element.type === 'rect') {
    elementSelection.attr('width', size.x).attr('height', size.y);
  }
  if (element.type === 'ellipse') {
    elementSelection.attr('rx', size.x).attr('ry', size.y);
  }
  if (element.type === 'line') {
    const position = getCoordinate({ coordinateEquations: element.position, state });
    const endpoint = addCoordinates({ leftArg: position, rightArg: size });
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
