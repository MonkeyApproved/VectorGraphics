import * as d3 from 'd3';
import { Position, Size } from './coordinate';
import { Fill } from './fill';
import { Stroke } from './stroke';
import { Transformation } from './transformation';

export function generateId(): string {
  return Math.random().toString(16).slice(2);
}

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;
export type ElementTypes = 'group' | 'line' | 'rect' | 'ellipse' | 'path' | 'circle' | 'polygon';
export const elementCounter: { [key: string]: number } = {
  group: 0,
  line: 0,
  rect: 0,
  ellipse: 0,
  path: 0,
};

export function getElementId(type: ElementTypes): string {
  elementCounter[type] += 1;
  return `${type}${elementCounter[type]}`;
}

export interface BaseElement {
  id: string;
  type: ElementTypes;
  // dependencies
  containerId: string;
  children?: string[];
  // positioning
  position: Position;
  size: Size;
  path: string;
  transformations?: Transformation[];
  // styling
  stroke?: Stroke;
  fill?: Fill;
}
