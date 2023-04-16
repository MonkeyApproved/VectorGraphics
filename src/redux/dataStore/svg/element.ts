import * as d3 from 'd3';
import { DataState } from '../dataSlice';
import { Position, Size } from './coordinate';
import { FillStyle } from './fill';
import { drawGroup, Group } from './group';
import { Stroke } from './stroke';
import { Transformation } from './transformation';
import { drawPath, Path } from './path';
import { applyBaseElementAttributes } from './applyAttributes';

export function generateId(): string {
  return Math.random().toString(16).slice(2);
}

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;
export type ElementTypes = 'group' | 'line' | 'rect' | 'ellipse' | 'path';
export const elementCounter: { [key: string]: number } = {
  group: 0,
  line: 0,
  rect: 0,
  ellipse: 0,
  path: 0,
};

export function getId(type: ElementTypes): string {
  elementCounter[type] += 1;
  return `${type}${elementCounter[type]}`;
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

  if (element.type === 'path') {
    return drawPath({ path: element as Path, containerId, state });
  }

  const elementSelection = appendElementToContainer({ elementType: element.type, containerId });
  applyBaseElementAttributes({ element, elementSelection, state });
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
