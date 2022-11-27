import * as d3 from 'd3';
import { applyPosition, applySize, Coordinate, Size } from './coordinate';
import { applyFill, FillStyle } from './fill';
import { drawGroup, Group } from './group';
import { applyStroke, Stroke } from './stroke';
import { Transformation } from './transformation';

export const ELEMENT_ID_PREFIX = 'element_';
export function generateId(): string {
  return Math.random().toString(16).slice(2);
}

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;
export type ElementTypes = 'group' | 'line' | 'rect' | 'ellipse';
export let elementCounter = 0;

export function getId(): string {
  elementCounter += 1;
  return `${elementCounter}`;
}

export interface BaseElement {
  id: string;
  containerId: string;
  type: ElementTypes;
  position: Coordinate;
  size: Size;
  stroke?: Stroke;
  fill?: FillStyle;
  transformations?: Transformation[];
  enableDrag: boolean;
}

export interface BaseElementFunction {
  element: BaseElement;
  elementSelection: ElementSelection;
}

export interface ElementAndContainerProps {
  element: BaseElement;
  containerId: string;
}

export function drawElement({ element, containerId }: ElementAndContainerProps): BaseElement {
  if (element.type === 'group') {
    return drawGroup({ group: element as Group, containerId });
  }

  const elementSelection = appendElementToContainer({ element, containerId });
  setBaseElementAttributes({ element, elementSelection });
  return element;
}

export function selectElementById({ elementId }: { elementId: string }): ElementSelection {
  return d3.select(`#${ELEMENT_ID_PREFIX}${elementId}`);
}

export function appendElementToContainer({ element, containerId }: ElementAndContainerProps): ElementSelection {
  const containerSelection = selectElementById({ elementId: containerId });
  return containerSelection.append(element.type);
}

export function setBaseElementAttributes({ element, elementSelection }: BaseElementFunction): BaseElement {
  applyId({ element, elementSelection });
  applyFill({ element, elementSelection });
  applyStroke({ element, elementSelection });
  applyPosition({ element, elementSelection });
  applySize({ element, elementSelection });
  if (element.enableDrag) {
    // applyHandlers({ element: element });  TODO: add back mouse drag handlers
  }
  return element;
}

export function applyId({ element, elementSelection }: BaseElementFunction): BaseElement {
  elementSelection.attr('id', `${ELEMENT_ID_PREFIX}${element.id}`);
  return element;
}

export function getNewElement(args: Omit<BaseElement, 'id'>): BaseElement {
  return { id: getId(), ...args };
}
