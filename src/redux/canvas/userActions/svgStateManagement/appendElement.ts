import { Canvas } from '../../canvas';
import { Shape } from '../../shape';
import { Style } from '../../style';
import { ElementSelection, selectExistingCanvas } from './selectElement';
import { setShapeAttributes, setStyleAttributes } from './updateShape';

export function appendElement({
  parent,
  elementType,
}: {
  parent: ElementSelection;
  elementType: string;
}): ElementSelection {
  return parent.append(elementType);
}

export function appendElementToCanvas({ canvas, shape, style }: { canvas: Canvas; shape: Shape; style?: Style }): void {
  const canvasSelection = selectExistingCanvas({ canvas });
  const shapeSelection = appendElement({ parent: canvasSelection, elementType: shape.type });
  setShapeAttributes({ shape, selection: shapeSelection });
  if (style) {
    setStyleAttributes({ style, selection: shapeSelection });
  }
}
