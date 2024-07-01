import { CSSProperties, DOMAttributes, createElement, useEffect } from 'react';
import { updateShapeFromVariableNamespace, useAppDispatch } from 'src/redux/reducers';
import { getCanvasElementDetails, getNamespaceOrUndefined, useAppSelector } from 'src/redux/selectors';
import { Shape, Style } from 'src/redux/types';
import { getSvgShapeParams, getSvgStyleParams } from 'src/redux/utils';

export interface ElementProps {
  elementId: string;
  canvasId: string;
  overwriteStyle?: Style;
  elementProps?: DOMAttributes<SVGElement>;
  style?: CSSProperties;
}

export default function Element({ elementId, canvasId, overwriteStyle, elementProps = {}, style = {} }: ElementProps) {
  // current redux state
  const dispatch = useAppDispatch();
  const details = useAppSelector((state) => getCanvasElementDetails(state, elementId, canvasId));
  const shapeNamespace = useAppSelector((state) => getNamespaceOrUndefined(state, details.shape.id));

  useEffect(() => {
    if (shapeNamespace && shapeNamespace.version !== details.shape.namespaceVersion) {
      dispatch(updateShapeFromVariableNamespace({ shapeId: details.shape.id, namespace: shapeNamespace }));
    }
  }, [shapeNamespace?.version]);

  // svg properties for shape, style and transformations (TODO)
  const attributes = getSvgShapeParams({ shape: details.shape });
  const svgStyle = getSvgStyleParams({ style: overwriteStyle || details.style });

  // create svg element
  return createElement(details.shape.type, {
    ...attributes,
    ...elementProps,
    style: { ...svgStyle, ...style },
  });
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
