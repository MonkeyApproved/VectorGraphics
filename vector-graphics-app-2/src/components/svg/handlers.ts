import { BaseElementType, ElementDict } from './element';

export type HandlerFunction = ({ elementId }: { elementId: string }) => void;

export interface ElementHandlers {
  onClick?: HandlerFunction;
  onMouseenter?: HandlerFunction;
  onMouseout?: HandlerFunction;
}

export function addHandlers({ element }: { element: BaseElementType }): BaseElementType {
  if (!element.ref || !element.handlers) {
    return element;
  }
  element.ref.on('click', () => {
    if (element.handlers?.onClick) {
      element.handlers?.onClick({ elementId: element.id });
    }
  });
  element.ref.on('mouseenter', () => {
    if (element.handlers?.onMouseenter) {
      element.handlers?.onMouseenter({ elementId: element.id });
    }
  });
  element.ref.on('mouseout', () => {
    if (element.handlers?.onMouseout) {
      element.handlers?.onMouseout({ elementId: element.id });
    }
  });

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
