import { CanvasState } from './slice';
import { Element } from './element';
import { Group } from './group';
import { ElementIdPrefix, GroupIdPrefix } from './id';

export function applyStyle({ targetId, styleId, state }: { targetId: string; styleId: string; state: CanvasState }) {
  // make sure the style exists
  const style = state.styles[styleId];
  if (!style) {
    throw new Error(`Style with id ${styleId} not found`);
  }

  // find the correct target based on the id
  let target: Group | Element;
  if (targetId.startsWith(GroupIdPrefix)) {
    // target is a group
    target = state.groups[targetId];
  } else if (targetId.startsWith(ElementIdPrefix)) {
    // target is an element
    target = state.elements[targetId];
  } else {
    throw new Error(`Cannot apply to ${targetId}, only groups and elements are supported`);
  }

  // make sure the target exists
  if (!target) {
    throw new Error(`Target with id ${targetId} not found`);
  }

  // if the target already has the style, do nothing
  if (target.styleId === styleId) {
    return;
  }

  // reduce usage count of old style
  if (target.styleId) {
    state.styles[target.styleId].stats.usages--;
  }

  // apply the new style and update stats
  target.styleId = styleId;
  target.stats.version++;
  style.stats.usages++;
}

export function getCanvasElement({ id, state }: { id: string; state: CanvasState }): Element | Group | undefined {
  if (id.startsWith(GroupIdPrefix)) {
    return state.groups[id];
  } else if (id.startsWith(ElementIdPrefix)) {
    return state.elements[id];
  }
  throw new Error(`Unknown canvas element type for id ${id}. Expected group or element.`);
}

export function getExistingCanvasElement({ id, state }: { id: string; state: CanvasState }): Element | Group {
  const element = getCanvasElement({ id, state });
  if (!element) {
    throw new Error(`Canvas element with id ${id} not found`);
  }
  return element;
}
