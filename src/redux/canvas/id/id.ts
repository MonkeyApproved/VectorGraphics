import { CanvasState } from '../canvasSlice';
import { ShapeType } from '../shape';

export function getShapeId({ type, state }: { type: ShapeType; state: CanvasState }): string {
  if (!state.counters.shapes[type]) {
    throw new Error(`Unknown shape type ${type}`);
  }
  state.counters.shapes[type] += 1;
  return `${type}${state.counters.shapes[type]}`;
}

export const StyleIdSuffix = 'style';
export function getStyleId({ state }: { state: CanvasState }): string {
  state.counters.styles += 1;
  return `${StyleIdSuffix}${state.counters.styles}`;
}

export const TransformationIdSuffix = 'transformation';
export function getTransformationId({ state }: { state: CanvasState }): string {
  state.counters.transformations += 1;
  return `${TransformationIdSuffix}${state.counters.transformations}`;
}

export const ElementIdSuffix = 'element';
export function getElementId({ state }: { state: CanvasState }): string {
  state.counters.elements += 1;
  return `${ElementIdSuffix}${state.counters.elements}`;
}

export const GroupIdSuffix = 'group';
export function getGroupId({ state }: { state: CanvasState }): string {
  state.counters.groups += 1;
  return `${GroupIdSuffix}${state.counters.groups}`;
}

export type IdType =
  | ShapeType
  | typeof TransformationIdSuffix
  | typeof StyleIdSuffix
  | typeof ElementIdSuffix
  | typeof GroupIdSuffix;

export function getId({ type, state }: { type: IdType; state: CanvasState }): string {
  if (type === StyleIdSuffix) return getStyleId({ state });
  if (type === TransformationIdSuffix) return getTransformationId({ state });
  if (type === ElementIdSuffix) return getElementId({ state });
  if (type === GroupIdSuffix) return getGroupId({ state });
  return getShapeId({ type, state });
}
