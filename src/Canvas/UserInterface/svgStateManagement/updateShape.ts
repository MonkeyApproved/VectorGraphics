import { getSvgShapeParams, getSvgStyleParams } from 'src/redux/utils';
import { ElementSelection } from './selectElement';
import { AnyShape, Style } from 'src/redux/types';

export function setShapeAttributes({ shape, selection }: { shape: AnyShape; selection: ElementSelection }) {
  const params = getSvgShapeParams({ shape });
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      selection.attr(key, value);
    }
  }
}

export function setStyleAttributes({ style, selection }: { style?: Style; selection: ElementSelection }) {
  const params = getSvgStyleParams({ style });
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      selection.style(key, value);
    }
  }
}
