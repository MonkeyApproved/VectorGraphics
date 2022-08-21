import { BaseElement, BaseElementType } from './element';

export const defaultStrokeStyle: Stroke = {
  color: 'black',
  opacity: 1,
  width: 1,
};

export interface Stroke {
  color?: string;
  opacity?: number;
  width?: number;
  lineJoin?: 'miter' | 'round' | 'bevel'; // style of line connections (pointy, round or squared-off)
  miterLimit?: number; // in case of lineJoin: "miter", this defines at which point we switch to squared-off
  lineCap?: 'butt' | 'round' | 'square'; // line endings
  dashArray?: number[];
  dashOffset?: number;
}

export interface UpdateStrokeProps {
  element: BaseElement;
  updates: Partial<Stroke>;
}

export function updateStroke({ element, updates }: UpdateStrokeProps): BaseElement {
  const newStroke = { ...element.stroke, ...updates };
  return { ...element, stroke: newStroke };
}

export function applyStroke({ element }: { element: BaseElementType }): BaseElementType {
  if (!element.ref || !element.stroke) {
    return element;
  }
  if (element.stroke.color) {
    element.ref.style('stroke', element.stroke.color);
  }
  if (element.stroke.opacity) {
    element.ref.style('stroke-opacity', element.stroke.opacity);
  }
  if (element.stroke.width) {
    element.ref.style('stroke-width', element.stroke.width);
  }
  if (element.stroke.lineJoin) {
    element.ref.style('stroke-linejoin', element.stroke.lineJoin);
  }
  if (element.stroke.lineJoin === 'miter' && element.stroke.miterLimit) {
    element.ref.style('stroke-miterlimit', element.stroke.miterLimit);
  }
  if (element.stroke.lineCap) {
    element.ref.style('stroke-linecap', element.stroke.lineCap);
  }
  if (element.stroke.dashArray) {
    element.ref.style('stroke-dasharray', element.stroke.dashArray.join(' '));
  }
  if (element.stroke.dashArray && element.stroke.dashOffset) {
    element.ref.style('stroke-dashoffset', element.stroke.dashOffset);
  }
  return element;
}
