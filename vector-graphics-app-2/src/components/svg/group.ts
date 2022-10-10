import { appendElementToContainer, BaseElement, drawElement, setBaseElementAttributes } from './element';
import { addElement, ElementDict, forEachElement, removeElement, updateElement } from './elementDict';

export interface Group extends BaseElement {
  type: 'group';
  elements: ElementDict;
}

export interface AddElementToGroupProps {
  element: BaseElement;
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
  updatedElement: BaseElement;
  group: Group;
}

export function updateElementInGroup({ updatedElement, group }: UpdateElementInGroupProps) {
  const elements = updateElement({ dict: group.elements, updatedElement });
  return { ...group, elements: elements };
}

export interface DrawGroupProps {
  group: Group;
  containerId: string;
}

export function drawGroup({ group, containerId }: DrawGroupProps): Group {
  // add group to container
  const groupSelection = appendElementToContainer({ element: group, containerId });

  // set styles & other base attributes
  setBaseElementAttributes({ element: group, elementSelection: groupSelection });

  // draw all elements inside the group
  forEachElement({ dict: group.elements, func: (element) => drawElement({ element, containerId: group.id }) });

  return group;
}
