import { BaseElement, BaseElementFunction, ElementSelection } from './element';

export const defaultFillStyle: FillStyle = {
  color: 'black',
  opacity: 1,
};

export interface FillStyle {
  color?: string;
  opacity?: number;
  rule?: 'nonzero' | 'evenodd';
}

export function applyElementFill({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection || !element.fill) {
    return element;
  }
  applyFill({ fill: element.fill, elementSelection });
  return element;
}

export function applyFill({ fill, elementSelection }: { fill: FillStyle; elementSelection: ElementSelection }) {
  if (fill.color) {
    elementSelection.style('fill', fill.color);
  }
  if (fill.opacity) {
    elementSelection.style('fill-opacity', fill.opacity);
  }
  if (fill.rule) {
    elementSelection.style('fill-rule', fill.rule);
  }
}
