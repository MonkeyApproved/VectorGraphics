import * as d3 from 'd3';
import { BaseSyntheticEvent } from 'react';
import { DataState } from '../dataSlice';
import { getNumberFromEquation } from '../equations/equation';
import { BaseElement } from './element';

export interface Coordinate {
  x: number | string;
  xOffset: number;
  y: number | string;
  yOffset: number;
}

export type Position = Coordinate;
export type Size = Coordinate;

export interface CoordinatePixels {
  x: number;
  y: number;
}

export function getNumberInPixels({ number, state }: { number: number | string; state: DataState }): number {
  return typeof number === 'number' ? number : getNumberFromEquation({ equationId: number, state });
}

export function getCoordinatePixels({
  coordinate,
  state,
}: {
  coordinate: Coordinate;
  state: DataState;
}): CoordinatePixels {
  return {
    x: getNumberInPixels({ number: coordinate.x, state }) + coordinate.xOffset,
    y: getNumberInPixels({ number: coordinate.y, state }) + coordinate.yOffset,
  };
}

export interface CoordinateMathProps {
  leftArg: CoordinatePixels;
  rightArg: CoordinatePixels;
}

export function addCoordinates({ leftArg, rightArg }: CoordinateMathProps): CoordinatePixels {
  return { x: leftArg.x + rightArg.x, y: leftArg.y + rightArg.y };
}

export function subtractCoordinates({ leftArg, rightArg }: CoordinateMathProps): CoordinatePixels {
  return { x: leftArg.x - rightArg.x, y: leftArg.y - rightArg.y };
}

export interface SetCoordinateProps {
  element: BaseElement;
  x: string | number;
  y: string | number;
  state: DataState;
}

export function getMousePosition({ event }: { event: BaseSyntheticEvent }): CoordinatePixels {
  const position = d3.pointer(event);
  return { x: position[0], y: position[1] };
}

export function getOffsetAfterDrag({
  initialElementOffset,
  initialMousePosition,
  currentMousePosition,
}: {
  initialElementOffset: CoordinatePixels;
  initialMousePosition: CoordinatePixels;
  currentMousePosition: CoordinatePixels;
}): CoordinatePixels {
  const delta = subtractCoordinates({ leftArg: currentMousePosition, rightArg: initialMousePosition });
  return addCoordinates({ leftArg: initialElementOffset, rightArg: delta });
}
