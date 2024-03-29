import { BaseElement } from './element';

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
