import * as d3 from 'd3';
import { DataState } from '../dataSlice';
import { applyElementPosition, applyElementSize, Coordinate, Position, Size } from './coordinate';
import { applyElementArea } from './area';
import { applyElementFill, FillStyle } from './fill';
import { drawGroup, Group } from './group';
import { applyElementStroke, Stroke } from './stroke';
import { Transformation } from './transformation';

export function generateId(): string {
  return Math.random().toString(16).slice(2);
}

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;
export type ElementTypes = 'group' | 'line' | 'rect' | 'ellipse';
export const elementCounter: { [key: string]: number } = {
  group: 0,
  line: 0,
  rect: 0,
  ellipse: 0,
};

export function getId(type: ElementTypes): string {
  elementCounter[type] += 1;
  return `${type}_${elementCounter[type]}`;
}

export interface BaseElementPixels {
  containerId: string;
  type: ElementTypes;
  position: Coordinate;
  size: Coordinate;
  stroke?: Stroke;
  fill?: FillStyle;
  transformations?: Transformation[];
}

export interface BaseElement {
  id: string;
  containerId: string;
  type: ElementTypes;
  position: Position;
  size: Size;
  stroke?: Stroke;
  fill?: FillStyle;
  transformations?: Transformation[];
  enableDrag?: boolean;
}

export interface NumberProperty {
  elementId: string;
  type: 'position' | 'size';
  dimension?: 'x' | 'y';
  unit: 'pixel' | 'percent';
}

export interface BaseElementFunction {
  element: BaseElement;
  elementSelection: ElementSelection;
  state: DataState;
}

export interface ElementAndContainerProps {
  element: BaseElement;
  containerId: string;
  state: DataState;
}

export function drawElement({ element, containerId, state }: ElementAndContainerProps): BaseElement {
  if (element.type === 'group') {
    return drawGroup({ group: element as Group, containerId, state });
  }

  const elementSelection = appendElementToContainer({ elementType: element.type, containerId });
  setBaseElementAttributes({ element, elementSelection, state });
  return element;
}

export function selectElementById({ elementId }: { elementId: string }): ElementSelection {
  return d3.select(`#${elementId}`);
}

export function appendElementToContainer({
  elementType,
  containerId,
}: {
  elementType: ElementTypes;
  containerId: string;
}): ElementSelection {
  const containerSelection = selectElementById({ elementId: containerId });
  return containerSelection.append(elementType);
}

export function updateElement({ elementId, state }: { elementId: string; state: DataState }) {
  const props: BaseElementFunction = {
    element: state.svg.elementDict[elementId],
    elementSelection: selectElementById({ elementId }),
    state,
  };
  applyElementPosition(props);
  applyElementSize(props);
}

export function setBaseElementAttributes(props: BaseElementFunction): void {
  applyElementId(props);
  applyElementFill(props);
  applyElementStroke(props);
  applyElementArea(props);
}

export function applyElementId({ element, elementSelection }: BaseElementFunction): void {
  applyId({ id: element.id, elementSelection });
}

export function applyId({ id, elementSelection }: { id: string; elementSelection: ElementSelection }) {
  elementSelection.attr('id', id);
}

export function getNewElement(element: Omit<BaseElement, 'id'>): BaseElement {
  return { id: getId(element.type), ...element };
}
