import { BaseContext } from 'src/redux/context';
import { Coordinate } from './types';
import { AnyShapeGeneric, BaseShape, Shape } from './shape';
import { DistributiveOmit } from 'react-redux';
import { getLineContext } from './shape/line';
import { getRectContext } from './shape/rect';

export interface SvgBaseContext extends BaseContext {
  type: 'svg';
  usage: string;
  label?: string;
}

export const svgCoordinateUsages: string[] = ['position', 'size', 'scale', 'skew', 'translate', 'radius'];
export interface SvgCoordinateContext extends SvgBaseContext {
  usage: 'position' | 'size' | 'scale' | 'skew' | 'translate' | 'radius';
  dimension: keyof Coordinate;
  initialValue: number;
}

export interface SvgRotationContext extends SvgBaseContext {
  usage: 'rotate';
  dimension: keyof Coordinate | 'angle';
}

export interface SvgStrokeContext extends SvgBaseContext {
  usage: 'stroke';
  dimension: 'width' | 'opacity' | 'miterLimit' | 'color' | 'dashArray' | 'dashOffset';
}

export interface SvgFillContext extends SvgBaseContext {
  usage: 'fill';
  dimension: 'color' | 'opacity';
}

export type SvgContext = SvgCoordinateContext | SvgRotationContext | SvgStrokeContext | SvgFillContext;

export const CANVAS_CONTEXT_TYPE = 'svg';

export interface CanvasContext extends BaseContext {
  type: typeof CANVAS_CONTEXT_TYPE;
}

export type ParameterContext = DistributiveOmit<SvgContext, 'type' | 'namespace'>;
export interface ParameterContextGroup {
  label: string;
  contexts: ParameterContext[];
}
export interface ContextGroup {
  label: string;
  contexts: SvgContext[];
}
export type GetShapeContextStructure<S extends BaseShape> = ({
  shape,
}: {
  shape: AnyShapeGeneric<S>;
}) => ParameterContextGroup[];

export function addNamespaceToContextGroups({
  parameterGroups,
  shape,
}: {
  parameterGroups: ParameterContextGroup[];
  shape: Shape;
}): ContextGroup[] {
  return parameterGroups.map((group) => ({
    label: group.label,
    contexts: group.contexts.map((context) => ({
      type: 'svg',
      namespace: shape.id,
      ...context,
    })),
  }));
}

export function getShapeContext({ shape }: { shape: Shape }): ContextGroup[] {
  if (shape.type === 'line') {
    return addNamespaceToContextGroups({ parameterGroups: getLineContext({ shape }), shape });
  } else if (shape.type === 'rect') {
    return addNamespaceToContextGroups({ parameterGroups: getRectContext({ shape }), shape });
  }
  return [];
}
