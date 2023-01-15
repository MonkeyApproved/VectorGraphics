import { DataState } from '../dataSlice';
import { addSvgPropertyEquation } from '../equations/equation';
import { BaseElement, BaseElementPixels, getId } from './element';

export interface ElementDict {
  [id: string]: BaseElement;
}

export interface AddElementProps {
  dict: ElementDict;
  newElement: Omit<BaseElement, 'id'>;
}

export function addElementToDict({ dict, newElement }: AddElementProps): BaseElement {
  const element: BaseElement = { ...newElement, id: `${newElement.type}_${getId(newElement.type)}` };
  dict[element.id] = element;
  return element;
}

export function addElementPixelsToDict({
  state,
  element,
}: {
  state: DataState;
  element: BaseElementPixels;
}): BaseElement {
  const id = getId(element.type);
  const unit = 'pixel';
  const baseElement: BaseElement = {
    id,
    containerId: element.containerId,
    type: element.type,
    position: {
      x: addSvgPropertyEquation({
        property: { elementId: id, unit, type: 'position', dimension: 'x' },
        initialValue: element.position.x,
        state,
      }),
      y: addSvgPropertyEquation({
        property: { elementId: id, unit, type: 'position', dimension: 'y' },
        initialValue: element.position.y,
        state,
      }),
    },
    size: {
      x: addSvgPropertyEquation({
        property: { elementId: id, unit, type: 'size', dimension: 'x' },
        initialValue: element.size.x,
        state,
      }),
      y: addSvgPropertyEquation({
        property: { elementId: id, unit, type: 'size', dimension: 'y' },
        initialValue: element.size.y,
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
