import { BaseAreaElement, setBaseAreaElementAttributes } from './element';
import { ContainerSelection } from './group';

export interface Rect extends BaseAreaElement<SVGRectElement> {
  type: 'rect';
}

export interface DrawRectProps {
  container: ContainerSelection;
  rect: Rect;
}

export function drawRect({ container, rect }: DrawRectProps) {
  const selection = rect.ref ? rect.ref : container.append('rect');
  const rectWithRef = { ...rect, ref: selection };
  setBaseAreaElementAttributes({ element: rectWithRef });
  return rectWithRef;
}
