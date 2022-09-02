import * as d3 from 'd3';
import {
  addElement,
  BaseElement,
  BaseElementType,
  drawElement,
  ElementDict,
  generateId,
  removeElement,
  setBaseElementAttributes,
  updateElement,
} from './element';
import { defaultFillStyle } from './fill';
import { defaultStrokeStyle } from './stroke';
import { Transformation } from './transformation';

export interface Group extends BaseElement<SVGGElement> {
  type: 'group';
  transformations: Transformation[];
  elements: ElementDict;
}

export type GroupSelection = d3.Selection<SVGGElement, unknown, null, undefined>;
export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type ContainerSelection = GroupSelection | SvgSelection;

export function createGroup({ elements }: { elements: ElementDict }): Group {
  return {
    id: generateId(),
    type: 'group',
    transformations: [],
    stroke: defaultStrokeStyle,
    fill: defaultFillStyle,
    elements: elements,
  };
}

export interface AddElementToGroupProps {
  element: BaseElementType;
  group: Group;
}

export function addElementToGroup({ element, group }: AddElementToGroupProps) {
  const elements = addElement({ dict: group.elements, newElement: element });
  return { ...group, elements };
}

export interface AddElementDictToGroupProps {
  elementDict: ElementDict;
  group: Group;
}

export function addElementDictToGroup({ elementDict, group }: AddElementDictToGroupProps) {
  const elements = { ...group.elements, ...elementDict };
  return { ...group, elements };
}

export interface RemoveElementFromGroupProps {
  elementId: string;
  group: Group;
}

export function removeElementFromGroup({ elementId, group }: RemoveElementFromGroupProps) {
  const elements = removeElement({ dict: group.elements, elementId: elementId });
  return { ...group, elements: elements };
}

export interface UpdateElementInGroupProps {
  updatedElement: BaseElementType;
  group: Group;
}

export function updateElementInGroup({ updatedElement, group }: UpdateElementInGroupProps) {
  const elements = updateElement({ dict: group.elements, updatedElement });
  return { ...group, elements: elements };
}

export interface DrawGroupProps {
  container: ContainerSelection;
  group: Group;
}

export function drawGroup({ container, group }: DrawGroupProps): Group {
  // add group to container and update reference
  const selection = group.ref ? group.ref : container.append('g');
  const groupWithRef: Group = { ...group, ref: selection };

  // set styles & other base attributes
  setBaseElementAttributes({ element: groupWithRef });

  // draw all elements and update their references
  const elementDict: ElementDict = {};
  Object.values(group.elements).forEach((element: BaseElementType) => {
    const elementWithRef = drawElement({ element, container: selection });
    elementDict[element.id] = elementWithRef;
  });

  return { ...groupWithRef, elements: elementDict };
}
