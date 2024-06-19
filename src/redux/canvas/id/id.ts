import { CanvasState } from '../canvasSlice';
import { ShapeType } from '../shape';

export function getShapeId({ type, state }: { type: ShapeType; state: CanvasState }): string {
  if (!state.counters.shapes[type]) {
    throw new Error(`Unknown shape type ${type}`);
  }
  state.counters.shapes[type] += 1;
  return `${type}${state.counters.shapes[type]}`;
}

export const StyleIdPrefix = 'style';
export function getStyleId({ state }: { state: CanvasState }): string {
  state.counters.styles += 1;
  return `${StyleIdPrefix}${state.counters.styles}`;
}

export const TransformationIdPrefix = 'transformation';
export function getTransformationId({ state }: { state: CanvasState }): string {
  state.counters.transformations += 1;
  return `${TransformationIdPrefix}${state.counters.transformations}`;
}

export const ElementIdPrefix = 'element';
export function getElementId({ state }: { state: CanvasState }): string {
  state.counters.elements += 1;
  return `${ElementIdPrefix}${state.counters.elements}`;
}

export const GroupIdPrefix = 'group';
export function getGroupId({ state }: { state: CanvasState }): string {
  state.counters.groups += 1;
  return `${GroupIdPrefix}${state.counters.groups}`;
}

export const CanvasIdPrefix = 'canvas';
export function getCanvasId({ state }: { state: CanvasState }): string {
  state.counters.canvases += 1;
  return `${CanvasIdPrefix}${state.counters.canvases}`;
}

export type IdType =
  | ShapeType
  | typeof TransformationIdPrefix
  | typeof StyleIdPrefix
  | typeof ElementIdPrefix
  | typeof GroupIdPrefix
  | typeof CanvasIdPrefix;

export function getId({ type, state }: { type: IdType; state: CanvasState }): string {
  if (type === StyleIdPrefix) return getStyleId({ state });
  if (type === TransformationIdPrefix) return getTransformationId({ state });
  if (type === ElementIdPrefix) return getElementId({ state });
  if (type === GroupIdPrefix) return getGroupId({ state });
  if (type === CanvasIdPrefix) return getCanvasId({ state });
  return getShapeId({ type, state });
}
