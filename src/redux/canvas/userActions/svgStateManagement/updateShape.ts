import { ElementSelection } from './selectElement';
import { AnyShape, getSvgShapeParams } from '../../shape';
import { Style, getSvgStyleParams } from '../../style';

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
