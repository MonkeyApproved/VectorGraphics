import { RefObject, createElement } from 'react';
import { getSvgStyleParams } from 'src/redux/utils';
import { ElementResolved } from 'src/redux/types';
import { getSvgShapeParams } from 'src/redux/utils';

export default function Element({ element }: { element: ElementResolved; canvasRef: RefObject<SVGSVGElement> }) {
  const attributes = getSvgShapeParams({ shape: element.shape });
  const style = getSvgStyleParams({ style: element.style });
  return createElement(element.shape.type, { ...attributes, style });
}
