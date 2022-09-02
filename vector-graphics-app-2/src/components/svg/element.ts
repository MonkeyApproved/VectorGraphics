import * as d3 from 'd3';
import { drawEllipse, Ellipse } from './circle';
import { applyPosition, applySize, Coordinate, Size } from './coordinate';
import { applyFill, FillStyle } from './fill';
import { ContainerSelection, drawGroup, Group } from './group';
import { applyHandlers, ElementHandlers } from './handlers';
import { drawLine, Line } from './line';
import { drawRect, Rect } from './rect';
import { applyStroke, Stroke } from './stroke';

export function generateId(): string {
  return Math.random().toString(16).slice(2);
}

export type ElementRef<T extends d3.BaseType = d3.BaseType> = d3.Selection<T, unknown, null, undefined>;

export interface BaseElement<T extends d3.BaseType = SVGElement> {
  id: string;
  type: string;
  stroke?: Stroke;
  fill?: FillStyle;
  ref?: ElementRef<T>;
  selected?: boolean;
  handlers?: ElementHandlers;
}

export function applyId({ element }: { element: BaseElementType }): BaseElementType {
  if (!element.ref || !element.fill) {
    return element;
  }
  element.ref.attr('id', element.id);
  return element;
}

export function setBaseElementAttributes({ element }: { element: BaseElementType }): BaseElementType {
  applyId({ element: element });
  applyFill({ element: element });
  applyStroke({ element: element });
  return element;
}

export interface BaseAreaElement<T extends d3.BaseType = SVGElement> extends BaseElement<T> {
  position: Coordinate;
  size: Size;
}

export function setBaseAreaElementAttributes({ element }: { element: BaseAreaElementType }): BaseAreaElementType {
  setBaseElementAttributes({ element: element });
  applyPosition({ element: element });
  applySize({ element: element });
  applyHandlers({ element: element });
  return element;
}

export type BaseAreaElementType = Ellipse | Rect | Line;
export type BaseElementType = BaseAreaElementType | Group;

export interface DrawBaseElementProps<T extends BaseElement> {
  container: ContainerSelection;
  element: T;
}

export interface ElementDict {
  [id: string]: BaseElementType;
}

export interface AddElementProps {
  dict: ElementDict;
  newElement: BaseElementType;
}

export function addElement({ dict, newElement }: AddElementProps): ElementDict {
  const id = generateId();
  newElement.id = id;
  dict[id] = newElement;
  return dict;
}

export interface UpdateElementProps {
  dict: ElementDict;
  updatedElement: BaseElementType;
}

export function updateElement({ dict, updatedElement }: UpdateElementProps): ElementDict {
  dict[updatedElement.id] = updatedElement;
  return dict;
}

export interface RemoveElementProps {
  dict: ElementDict;
  elementId: string;
}

export function removeElement({ dict, elementId }: RemoveElementProps): ElementDict {
  delete dict[elementId];
  return dict;
}

export interface GetElementProps {
  dict: ElementDict;
  elementId: string;
}

export function getElement({ dict, elementId }: GetElementProps): BaseElementType {
  return dict[elementId];
}

export interface DrawElementProps {
  element: BaseElementType;
  container: ContainerSelection;
}

export function drawElement({ element, container }: DrawElementProps): BaseElementType {
  if (element.type === 'line') {
    return drawLine({ container: container, line: element });
  } else if (element.type === 'rect') {
    return drawRect({ container: container, rect: element });
  } else if (element.type === 'ellipse') {
    return drawEllipse({ container: container, ellipse: element });
  } else if (element.type === 'group') {
    return drawGroup({ container: container, group: element });
  }
  return element;
}

export function forEachElement(dict: ElementDict, func: (element: BaseElementType) => void): void {
  return Object.values(dict).forEach((element: BaseElementType) => func(element));
}

export function mapElements<ReturnType>(
  dict: ElementDict,
  func: (element: BaseElementType, index?: number) => ReturnType,
): ReturnType[] {
  return Object.values(dict).map((element: BaseElementType, index: number) => func(element, index));
}
