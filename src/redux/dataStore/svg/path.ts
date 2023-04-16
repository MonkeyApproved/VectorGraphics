import * as d3 from 'd3';
import { getCoordinatePixels, Position, Size } from './coordinate';
import { appendElementToContainer, BaseElement, getId } from './element';
import { DataState } from '../dataSlice';
import { applyBaseElementAttributes } from './applyAttributes';
import { defaultSvgSettings } from './settings';

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
  radius: Size;
  rotation: string | number;
  largeFlag: boolean;
  sweepFlag: boolean;
}

export type PathSegment = LineSegment | QuadraticCurveSegment | CubicCurveSegment | ArcSegment;

export interface Path extends BaseElement {
  type: 'path';
  segments: PathSegment[];
  definition: string;
  close: boolean;
}

export function parseSegmentDefinition({ cmd, definition }: { cmd: string; definition: string }): PathSegment {
  const args: number[] = definition
    .trim()
    .split(/[\s,]+/)
    .map((arg) => Number(arg));
  if (['M', 'm', 'L', 'l'].includes(cmd)) {
    // MOVETO & LINE:
    // these segments are in the from "L x y"
    if (args.length !== 2) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 2 expected`);
    }
    return {
      type: ['M', 'm'].includes(cmd) ? 'move' : 'line',
      absolute: ['M', 'L'].includes(cmd),
      endPoint: { x: args[0], y: args[1] },
    };
  } else if (['H', 'h', 'V', 'v'].includes(cmd)) {
    // HORIZONTAL & VERTICAL LINES:
    // these segments are in the from "H x" or "V y"
    if (args.length !== 1) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 1 expected`);
    }
    return {
      type: 'line',
      absolute: ['H', 'Z'].includes(cmd),
      endPoint: ['H', 'h'].includes(cmd) ? { x: args[0], y: 0 } : { x: 0, y: args[0] },
    };
  } else if (['C', 'c'].includes(cmd)) {
    // CUBIC BEZIER CURVE:
    // these segments are in the form "C x1 y1 x2 y2 x y" for the two control points and the endpoint
    if (args.length !== 6) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 6 expected`);
    }
    return {
      type: 'cubicCurve',
      absolute: cmd === 'C',
      smooth: false,
      endPoint: { x: args[4], y: args[5] },
      cp1: { x: args[0], y: args[1] },
      cp2: { x: args[2], y: args[3] },
    };
  } else if (['S', 's'].includes(cmd)) {
    // CUBIC BEZIER CURVE (smooth):
    // these segments are in the form "S x2 y2 x y", the first control point is defined by the previous segment
    if (args.length !== 4) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 4 expected`);
    }
    return {
      type: 'cubicCurve',
      absolute: cmd === 'S',
      smooth: true,
      endPoint: { x: args[2], y: args[3] },
      cp1: { x: args[0], y: args[1] },
      cp2: { x: args[0], y: args[1] },
    };
  } else if (['Q', 'q'].includes(cmd)) {
    // QUADRATIC BEZIER CURVE:
    // these segments are in the form "Q x1 y1 x y" for the single control point and the endpoint
    if (args.length !== 4) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 4 expected`);
    }
    return {
      type: 'quadraticCurve',
      absolute: cmd === 'Q',
      smooth: false,
      endPoint: { x: args[2], y: args[3] },
      cp: { x: args[0], y: args[1] },
    };
  } else if (['T', 't'].includes(cmd)) {
    // QUADRATIC BEZIER CURVE (smooth):
    // these segments are in the form "T x y", the control point is defined by the previous segment
    if (args.length !== 2) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 2 expected`);
    }
    return {
      type: 'quadraticCurve',
      absolute: cmd === 'T',
      smooth: true,
      cp: { x: 0, y: 0 },
      endPoint: { x: args[0], y: args[1] },
    };
  } else if (['A', 'a'].includes(cmd)) {
    // ARC:
    // these segments are in the form "A rx ry rot large-flag sweep-flag", the control point is defined by the previous segment
    if (args.length !== 7) {
      throw new Error(`Invalid path definition "${cmd}${definition}", got ${args.length} arguments, 7 expected`);
    }
    return {
      type: 'arc',
      absolute: cmd === 'A',
      endPoint: { x: args[5], y: args[6] },
      radius: { x: args[0], y: args[1] },
      rotation: args[2],
      largeFlag: args[3] === 1,
      sweepFlag: args[4] === 1,
    };
  }
  throw new Error(`Invalid path definition "${cmd}${definition}", unknown path type "${cmd}"`);
}

export function parsePathDefinition({ path }: { path: Path }): void {
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

export function addPathFromDefinition({ definition, state }: { definition: string; state: DataState }): Path {
  const id = getId('path');
  const newPath: Path = {
    id,
    containerId: state.svg.canvasId || '',
    type: 'path',
    position: { x: 0, y: 0 },
    size: { x: 0, y: 0 },
    ...defaultSvgSettings.defaultElementStyle,
    segments: [],
    definition,
    close: false,
  };
  parsePathDefinition({ path: newPath });
  state.svg.elementDict[id] = newPath;
  return newPath;
}
