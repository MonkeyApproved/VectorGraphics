import { BaseElement, BaseElementFunction, ElementSelection } from './element';

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

export function applyElementStroke({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection || !element.stroke) {
    return element;
  }
  applyStroke({ stroke: element.stroke, elementSelection });
  return element;
}

export function applyStroke({ stroke, elementSelection }: { stroke: Stroke; elementSelection: ElementSelection }) {
  if (stroke.color) {
    elementSelection.style('stroke', stroke.color);
  }
  if (stroke.opacity) {
    elementSelection.style('stroke-opacity', stroke.opacity);
  }
  if (stroke.width) {
    elementSelection.style('stroke-width', stroke.width);
  }
  if (stroke.lineJoin) {
    elementSelection.style('stroke-linejoin', stroke.lineJoin);
  }
  if (stroke.lineJoin === 'miter' && stroke.miterLimit) {
    elementSelection.style('stroke-miterlimit', stroke.miterLimit);
  }
  if (stroke.lineCap) {
    elementSelection.style('stroke-linecap', stroke.lineCap);
  }
  if (stroke.dashArray) {
    elementSelection.style('stroke-dasharray', stroke.dashArray.join(' '));
  }
  if (stroke.dashArray && stroke.dashOffset) {
    elementSelection.style('stroke-dashoffset', stroke.dashOffset);
  }
}
