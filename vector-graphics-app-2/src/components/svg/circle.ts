import { BaseAreaElement, setBaseAreaElementAttributes } from './element';
import { ContainerSelection } from './group';

export interface Ellipse extends BaseAreaElement<SVGEllipseElement> {
  type: 'ellipse';
}

export interface DrawEllipseProps {
  container: ContainerSelection;
  ellipse: Ellipse;
}

export function drawEllipse({ container, ellipse }: DrawEllipseProps): Ellipse {
  const selection = ellipse.ref ? ellipse.ref : container.append(ellipse.type);
  const ellipseWithRef = { ...ellipse, ref: selection };
  setBaseAreaElementAttributes({ element: ellipseWithRef });
  return ellipseWithRef;
}
