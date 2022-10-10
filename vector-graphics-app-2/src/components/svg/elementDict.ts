import { BaseElement, getId } from './element';

export interface ElementDict {
  [id: string]: BaseElement;
}

export interface AddElementProps {
  dict: ElementDict;
  newElement: BaseElement;
}

export function addElement({ dict, newElement }: AddElementProps): ElementDict {
  newElement.id = getId();
  dict[newElement.id] = newElement;
  return dict;
}

export interface UpdateElementProps {
  dict: ElementDict;
  updatedElement: BaseElement;
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

export function getElement({ dict, elementId }: GetElementProps): BaseElement {
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
