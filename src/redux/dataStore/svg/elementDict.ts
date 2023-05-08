import { DataState } from '../dataSlice';
import { updateSvgPropertyEquation } from '../equations/svgEquation';
import { BaseElement, getElementId } from './element';

export interface ElementDict {
  [id: string]: BaseElement;
}

export interface AddElementProps {
  dict: ElementDict;
  newElement: Omit<BaseElement, 'id'>;
}

export function addElementToDict({ dict, newElement }: AddElementProps): BaseElement {
  const element: BaseElement = { ...newElement, id: `${newElement.type}_${getElementId(newElement.type)}` };
  dict[element.id] = element;
  return element;
}

export function addNewElement({ state, element }: { state: DataState; element: Omit<BaseElement, 'id'> }): BaseElement {
  const id = getElementId(element.type);
  const baseElement: BaseElement = {
    id,
    containerId: element.containerId,
    type: element.type,
    position: {
      x: updateSvgPropertyEquation({
        property: { elementId: id, type: 'position', dimension: 'x' },
        value: element.position.x,
        state,
      }),
      y: updateSvgPropertyEquation({
        property: { elementId: id, type: 'position', dimension: 'y' },
        value: element.position.y,
        state,
      }),
    },
    size: {
      x: updateSvgPropertyEquation({
        property: { elementId: id, type: 'size', dimension: 'x' },
        value: element.size.x,
        state,
      }),
      y: updateSvgPropertyEquation({
        property: { elementId: id, type: 'size', dimension: 'y' },
        value: element.size.y,
        state,
      }),
    },
    stroke: element.stroke,
    fill: element.fill,
    transformations: element.transformations,
    enableDrag: true,
  };
  state.svg.elementDict[id] = baseElement;
  return baseElement;
}

export interface UpdateElementProps {
  dict: ElementDict;
  updatedElement: BaseElement;
}

export function updateElementInDict({ dict, updatedElement }: UpdateElementProps): ElementDict {
  dict[updatedElement.id] = updatedElement;
  return dict;
}

export interface RemoveElementProps {
  dict: ElementDict;
  elementId: string;
}

export function removeElementFromDict({ dict, elementId }: RemoveElementProps): ElementDict {
  delete dict[elementId];
  return dict;
}

export interface GetElementProps {
  dict: ElementDict;
  elementId: string;
}

export function getElementFromDict({ dict, elementId }: GetElementProps): BaseElement {
  return dict[elementId];
}

export interface ElementDictIterators<ReturnType> {
  dict: ElementDict;
  func: (element: BaseElement, index?: number) => ReturnType;
}

export function forEachElement({ dict, func }: ElementDictIterators<void>): void {
  return Object.values(dict).forEach((element: BaseElement, index: number) => func(element, index));
}

export function mapElements<ReturnType>({ dict, func }: ElementDictIterators<ReturnType>): ReturnType[] {
  return Object.values(dict).map((element: BaseElement, index: number) => func(element, index));
}
