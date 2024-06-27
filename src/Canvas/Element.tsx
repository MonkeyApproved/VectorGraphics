import { createElement } from 'react';
import { getSvgStyleParams } from 'src/redux/utils';
import { getSvgShapeParams } from 'src/redux/utils';
import { getCanvasElementDetails, useAppSelector } from 'src/redux/selectors';

export default function Element({ elementId, canvasId }: { elementId: string; canvasId: string }) {
  const details = useAppSelector(getCanvasElementDetails({ elementId, canvasId }));
  const attributes = getSvgShapeParams({ shape: details.shape });
  const style = getSvgStyleParams({ style: details.style });
  return createElement(details.shape.type, { ...attributes, style });
}
