import { AnyShape, Style, SvgSettings } from 'src/redux/types';
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

export function appendElementToCanvas({
  canvasId,
  shape,
  style,
}: {
  canvasId: string;
  shape: AnyShape;
  style?: Style;
}): ElementSelection {
  const canvasSelection = selectExistingCanvas({ canvasId });
  const shapeSelection = appendElement({ parent: canvasSelection, elementType: shape.type });
  setShapeAttributes({ shape, selection: shapeSelection });
  if (style) {
    setStyleAttributes({ style, selection: shapeSelection });
  }
  return shapeSelection;
}

export function appendSelectionRectToCanvas({
  canvasId,
  canvasSettings,
}: {
  canvasId: string;
  canvasSettings: SvgSettings;
}): ElementSelection {
  const canvasSelection = selectExistingCanvas({ canvasId });
  const elementSelection = appendElement({ parent: canvasSelection, elementType: 'rect' });
  setStyleAttributes({ selection: elementSelection, style: canvasSettings.selectionBoxStyle });
  return elementSelection;
}
