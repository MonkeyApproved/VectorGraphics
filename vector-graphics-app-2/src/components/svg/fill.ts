import { BaseElementType } from './element';

export const defaultFillStyle: FillStyle = {
  color: 'black',
  opacity: 1,
};

export interface FillStyle {
  color?: string;
  opacity?: number;
  rule?: 'nonzero' | 'evenodd';
}

export function applyFill({ element }: { element: BaseElementType }): BaseElementType {
  if (!element.ref || !element.fill) {
    return element;
  }
  if (element.fill.color) {
    element.ref.style('fill', element.fill.color);
  }
  if (element.fill.opacity) {
    element.ref.style('fill-opacity', element.fill.opacity);
  }
  if (element.fill.rule) {
    element.ref.style('fill-rule', element.fill.rule);
  }
  return element;
}
