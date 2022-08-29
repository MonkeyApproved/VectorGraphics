import { BaseElementType, ElementDict } from './element';

export interface HandlerFunctionProps {
  element: BaseElementType;
  event?: MouseEvent;
}

export type HandlerFunction = ({ element, event }: HandlerFunctionProps) => void;

export interface ElementHandlers {
  [eventName: string]: HandlerFunction;
}

export function applyHandlers({ element }: { element: BaseElementType }): BaseElementType {
  if (!element.ref || !element.handlers) {
    return element;
  }
  for (const eventName in element.handlers) {
    const handler = element.handlers[eventName];
    element.ref.on(eventName, (event: MouseEvent) => {
      handler({ element, event });
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
