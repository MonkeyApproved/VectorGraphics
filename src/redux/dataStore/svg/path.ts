import * as d3 from 'd3';
import { getCoordinatePixels, getNumberInPixels, Position } from './coordinate';
import { appendElementToContainer, BaseElement } from './element';
import { DataState } from '../dataSlice';
import { applyBaseElementAttributes } from './applyAttributes';

export type PathSegmentTypes = 'move' | 'line' | 'quadraticCurve' | 'cubicCurve' | 'arc';

export interface BaseSegment {
  type: PathSegmentTypes;
  absolute: boolean;
  endPoint: Position;
}

export interface LineSegment extends BaseSegment {
  type: 'line' | 'move';
}

export interface QuadraticCurveSegment extends BaseSegment {
  type: 'quadraticCurve';
  smooth: boolean;
  cp: Position;
}

export interface CubicCurveSegment extends BaseSegment {
  type: 'cubicCurve';
  smooth: boolean;
  cp1: Position;
  cp2: Position;
}

export interface ArcSegment extends BaseSegment {
  type: 'arc';
  cp: Position;
  radius: string;
}

export type PathSegment = LineSegment | QuadraticCurveSegment | CubicCurveSegment | ArcSegment;

export interface Path extends BaseElement {
  type: 'path';
  segments: PathSegment[];
  definition: string;
  close: boolean;
}
/**
export function parseSegmentDefinition({ cmd, definition }: { cmd: string; definition: string }): PathSegment {
  const args: number[] = definition.split(/[\s,]/).forEach((arg) => Number(arg));
  if (['M', 'm', 'L', 'l'].includes(cmd)) {
    if (args.length !== 2) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 2 expected`);
    }
    const endPoint =
    return {
      type: ['M', 'm'].includes(cmd) ? 'line' : 'move',
      absolute: ['M', 'L'].includes(cmd),
      endPoint: {x: args[0], y: args[1]}
    }
  }
}

export function parsePathDefinition({ path, state }: { path: Path; state: DataState }): void {
  // check if the path is closed (Z at the end of the definition)
  path.close = false;
  let leftOver = path.definition.replace(/[Zz]\s$/, () => {
    path.close = true;
    return '';
  });

  // grab all segment definitions
  const segments: PathSegment[] = [];
  leftOver = leftOver.replace(/(?<cmd>[MLHVCSQTAmlhvcsqta])(?<definition>[\d\se\-.,]+)?/g, (_, cmd, definition) => {
    segments.push(parseSegmentDefinition({ cmd, definition }));
    return '';
  });

  // make sure all parts of the definition were successfully parsed (string should be empty)
  if (leftOver.length > 0) {
    throw new Error(`Unknown part "${leftOver}" in path definition "${path.definition}"`);
  }

  path.segments = segments;
}
*/
export function updatePathDefinition({ path, state }: { path: Path; state: DataState }): void {
  const definition = d3.path();
  path.segments.forEach((seg: PathSegment) => {
    const endPoint = getCoordinatePixels({ coordinate: seg.endPoint, state });
    if (seg.type === 'line') {
      definition.lineTo(endPoint.x, endPoint.y);
    } else if (seg.type === 'move') {
      definition.moveTo(endPoint.x, endPoint.y);
    } else if (seg.type === 'quadraticCurve') {
      const cp = getCoordinatePixels({ coordinate: seg.cp, state });
      definition.quadraticCurveTo(cp.x, cp.y, endPoint.x, endPoint.y);
    } else if (seg.type === 'cubicCurve') {
      const cp1 = getCoordinatePixels({ coordinate: seg.cp1, state });
      const cp2 = getCoordinatePixels({ coordinate: seg.cp2, state });
      definition.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPoint.x, endPoint.y);
    } else if (seg.type === 'arc') {
      const cp = getCoordinatePixels({ coordinate: seg.cp, state });
      const radius = getNumberInPixels({ number: seg.radius, state });
      definition.arcTo(cp.x, cp.y, endPoint.x, endPoint.y, radius);
    }
  });

  if (path.close) {
    definition.closePath();
  }

  path.definition = definition.toString();
}

export interface DrawPathProps {
  path: Path;
  containerId: string;
  state: DataState;
}

export function drawPath({ path, containerId, state }: DrawPathProps): Path {
  // add path to container
  const pathSelection = appendElementToContainer({ elementType: path.type, containerId });

  // set styles & other base attributes
  applyBaseElementAttributes({ element: path, elementSelection: pathSelection, state });

  // set "d" attribute, defining the path
  updatePathDefinition({ path, state });
  pathSelection.attr('d', path.definition);

  return path;
}
