import { BaseAreaElementType, BaseElementType, ElementDict } from './element';

export interface HandlerFunctionProps {
  elementId: string;
  event?: MouseEvent;
}

export type HandlerFunction = ({ elementId, event }: HandlerFunctionProps) => void;

export interface ElementHandlers {
  [eventName: string]: HandlerFunction;
}

export function applyHandlers({ element }: { element: BaseAreaElementType }): BaseAreaElementType {
  if (!element.ref || !element.handlers) {
    return element;
  }
  for (const eventName in element.handlers) {
    const handler = element.handlers[eventName];
    const elementId = element.id;
    element.ref.on(eventName, (event: MouseEvent) => {
      handler({ elementId, event });
    });
  }
  return element;
}

export interface UpdateHandlersInDictProps {
  elementDict: ElementDict;
  handlers: ElementHandlers;
}

export function updateHandlersInDict({ elementDict, handlers }: UpdateHandlersInDictProps) {
  Object.values(elementDict).forEach((element: BaseElementType) => {
    const newHandlers = { ...element.handlers, ...handlers };
    const updatedElement = { ...element, handlers: newHandlers };
    elementDict[element.id] = updatedElement;
  });
  return elementDict;
}
