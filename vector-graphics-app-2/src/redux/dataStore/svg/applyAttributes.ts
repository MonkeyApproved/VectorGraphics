import { DataState } from '../dataSlice';
import { Area, getElementArea } from './area';
import { CoordinatePixels, addCoordinates, getCoordinatePixels } from './coordinate';
import { BaseElement, BaseElementFunction, ElementSelection, ElementTypes, selectElementById } from './element';
import { FillStyle } from './fill';
import { Stroke } from './stroke';

export function applyElementEquationChanges({ elementId, state }: { elementId: string; state: DataState }) {
  const props: BaseElementFunction = {
    element: state.svg.elementDict[elementId],
    elementSelection: selectElementById({ elementId }),
    state,
  };
  applyElementArea(props);
}

export function applyBaseElementAttributes(props: BaseElementFunction): void {
  applyElementId(props);
  applyElementFill(props);
  applyElementStroke(props);
  applyElementArea(props);
}

export function applyElementId({ element, elementSelection }: BaseElementFunction): void {
  applyId({ id: element.id, elementSelection });
}

export function applyId({ id, elementSelection }: { id: string; elementSelection: ElementSelection }) {
  elementSelection.attr('id', id);
}

export function applyElementFill({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection || !element.fill) {
    return element;
  }
  applyFill({ fill: element.fill, elementSelection });
  return element;
}

export function applyFill({ fill, elementSelection }: { fill: FillStyle; elementSelection: ElementSelection }) {
  if (fill.color) {
    elementSelection.style('fill', fill.color);
  }
  if (fill.opacity) {
    elementSelection.style('fill-opacity', fill.opacity);
  }
  if (fill.rule) {
    elementSelection.style('fill-rule', fill.rule);
  }
}

export function applyElementStroke({ element, elementSelection }: BaseElementFunction): BaseElement {
  if (!elementSelection || !element.stroke) {
    return element;
  }
  applyStroke({ stroke: element.stroke, elementSelection });
  return element;
}

export function applyStroke({ stroke, elementSelection }: { stroke: Stroke; elementSelection: ElementSelection }) {
  if (stroke.color) {
    elementSelection.style('stroke', stroke.color);
  }
  if (stroke.opacity) {
    elementSelection.style('stroke-opacity', stroke.opacity);
  }
  if (stroke.width) {
    elementSelection.style('stroke-width', stroke.width);
  }
  if (stroke.lineJoin) {
    elementSelection.style('stroke-linejoin', stroke.lineJoin);
  }
  if (stroke.lineJoin === 'miter' && stroke.miterLimit) {
    elementSelection.style('stroke-miterlimit', stroke.miterLimit);
  }
  if (stroke.lineCap) {
    elementSelection.style('stroke-linecap', stroke.lineCap);
  }
  if (stroke.dashArray) {
    elementSelection.style('stroke-dasharray', stroke.dashArray.join(' '));
  }
  if (stroke.dashArray && stroke.dashOffset) {
    elementSelection.style('stroke-dashoffset', stroke.dashOffset);
  }
}

export function applyElementPosition({ element, elementSelection, state }: BaseElementFunction): BaseElement {
  const position = getCoordinatePixels({ coordinate: element.position, state });
  const size = getCoordinatePixels({ coordinate: element.size, state });
  applyPosition({ position, size, type: element.type, elementSelection });
  return element;
}

export function applyElementSize({ element, elementSelection, state }: BaseElementFunction): BaseElement {
  const position = getCoordinatePixels({ coordinate: element.position, state });
  const size = getCoordinatePixels({ coordinate: element.size, state });
  applySize({ position, size, type: element.type, elementSelection });
  return element;
}

export function applyElementArea({ element, elementSelection, state }: BaseElementFunction): BaseElement {
  const area = getElementArea({ element, state });
  applyArea({ area, type: element.type, elementSelection });
  return element;
}

export function applyPosition({
  position,
  size,
  type,
  elementSelection,
}: {
  position: CoordinatePixels;
  size: CoordinatePixels;
  type: ElementTypes;
  elementSelection: ElementSelection;
}) {
  if (type === 'rect') {
    elementSelection.attr('x', position.x).attr('y', position.y);
  }
  if (type === 'ellipse') {
    elementSelection.attr('cx', position.x).attr('cy', position.y);
  }
  if (type === 'line') {
    const endpoint = addCoordinates({ leftArg: position, rightArg: size });
    elementSelection.attr('x2', endpoint.x).attr('y2', endpoint.y);
    elementSelection.attr('x1', position.x).attr('y1', position.y);
  }
}

export function applySize({
  position,
  size,
  type,
  elementSelection,
}: {
  position: CoordinatePixels;
  size: CoordinatePixels;
  type: ElementTypes;
  elementSelection: ElementSelection;
}) {
  if (type === 'rect') {
    elementSelection.attr('width', size.x).attr('height', size.y);
  }
  if (type === 'ellipse') {
    elementSelection.attr('rx', size.x).attr('ry', size.y);
  }
  if (type === 'line') {
    const endpoint = addCoordinates({ leftArg: position, rightArg: size });
    elementSelection.attr('x2', endpoint.x).attr('y2', endpoint.y);
    elementSelection.attr('x1', position.x).attr('y1', position.y);
  }
}

export function applyArea({
  area,
  type,
  elementSelection,
}: {
  area: Area;
  type: ElementTypes;
  elementSelection: ElementSelection;
}) {
  if (type === 'rect') {
    elementSelection.attr('x', area.position.x).attr('y', area.position.y);
    elementSelection.attr('width', area.size.x).attr('height', area.size.y);
  }
  if (type === 'ellipse') {
    elementSelection.attr('cx', area.position.x).attr('cy', area.position.y);
    elementSelection.attr('rx', area.size.x).attr('ry', area.size.y);
  }
  if (type === 'line') {
    const endpoint = addCoordinates({ leftArg: area.position, rightArg: area.size });
    elementSelection.attr('x1', area.position.x).attr('y1', area.position.y);
    elementSelection.attr('x2', endpoint.x).attr('y2', endpoint.y);
  }
}
