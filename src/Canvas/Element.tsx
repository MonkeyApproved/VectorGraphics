import { createElement, useEffect } from 'react';
import { getSvgStyleParams } from 'src/redux/utils';
import { getSvgShapeParams } from 'src/redux/utils';
import { getCanvasElementDetails, getNamespaceOrUndefined, useAppSelector } from 'src/redux/selectors';
import { Shape, Style } from 'src/redux/types';
import { updateShapeFromVariableNamespace, useAppDispatch } from 'src/redux/reducers';

export interface ElementProps {
  elementId: string;
  canvasId: string;
  overwriteStyle?: Style;
}

export default function Element({ elementId, canvasId, overwriteStyle }: ElementProps) {
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
  const style = getSvgStyleParams({ style: overwriteStyle || details.style });

  // create svg element
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
