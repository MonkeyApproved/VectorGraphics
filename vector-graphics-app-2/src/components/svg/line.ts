import { BaseAreaElement, setBaseAreaElementAttributes } from './element';
import { ContainerSelection } from './group';

export interface Line extends BaseAreaElement<SVGLineElement> {
  type: 'line';
}

export interface DrawLineProps {
  container: ContainerSelection;
  line: Line;
}

export function drawLine({ container, line }: DrawLineProps): Line {
  const selection = line.ref ? line.ref : container.append('line');
  const lineWithRef = { ...line, ref: selection };
  setBaseAreaElementAttributes({ element: lineWithRef });
  return lineWithRef;
}
