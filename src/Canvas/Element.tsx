import { createElement } from 'react';
import { getSvgStyleParams } from 'src/redux/utils';
import { getSvgShapeParams } from 'src/redux/utils';
import { getCanvasElementDetails, useAppSelector } from 'src/redux/selectors';
import { Shape, Style } from 'src/redux/types';

export interface ElementProps {
  elementId: string;
  canvasId: string;
  overwriteStyle?: Style;
}

export default function Element({ elementId, canvasId, overwriteStyle }: ElementProps) {
  const details = useAppSelector(getCanvasElementDetails({ elementId, canvasId }));
  const attributes = getSvgShapeParams({ shape: details.shape });
  const style = getSvgStyleParams({ style: overwriteStyle || details.style });
  return createElement(details.shape.type, { ...attributes, style });
}

export interface ElementFromShapeProps {
  shape: Shape;
  style: Style;
}

export function ElementFromShape({ shape, style }: ElementFromShapeProps) {
  const attributes = getSvgShapeParams({ shape });
  const styleParams = getSvgStyleParams({ style });
  return createElement(shape.type, { ...attributes, style: styleParams });
}
