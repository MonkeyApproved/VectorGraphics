import { BaseElement, selectElementById } from '../svg/element';

export interface HandlerFunctionProps {
  elementId: string;
  event?: MouseEvent;
}

export type HandlerFunction = ({ elementId, event }: HandlerFunctionProps) => void;

export interface ElementHandlers {
  [eventName: string]: HandlerFunction;
}

export interface ApplyHandlersProps {
  element: BaseElement;
  handlers: ElementHandlers;
}

export function applyHandlers({ element, handlers }: ApplyHandlersProps): BaseElement {
  const elementSelection = selectElementById({ elementId: element.id });

  for (const eventName in handlers) {
    const handler = handlers[eventName];
    const elementId = element.id;
    elementSelection.on(eventName, (event: MouseEvent) => {
      handler({ elementId, event });
    });
  }
  return element;
}
