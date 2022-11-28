import { BaseElement, BaseElementFunction } from './element';

export const defaultFillStyle: FillStyle = {
  color: 'black',
  opacity: 1,
};

export interface FillStyle {
  color?: string;
  opacity?: number;
  rule?: 'nonzero' | 'evenodd';
}

export function applyFill({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection || !element.fill) {
    return element;
  }
  if (element.fill.color) {
    elementSelection.style('fill', element.fill.color);
  }
  if (element.fill.opacity) {
    elementSelection.style('fill-opacity', element.fill.opacity);
  }
  if (element.fill.rule) {
    elementSelection.style('fill-rule', element.fill.rule);
  }
  return element;
}
