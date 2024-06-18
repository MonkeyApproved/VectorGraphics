import { Coordinate, Length } from '../../types';
import { getFreshStats } from '../../utils';
import { addCoordinates } from '../coordinateUtils';
import { Path } from '../path';
import { CubicCurveSegment, LineSegment, PathSegment, QuadraticCurveSegment } from './segmentTypes';

export function pathToShape({ id, label, definition }: { id: string; label: string; definition: string }): Path {
  // check if the path is closed (Z at the end of the definition)
  const path: Path = {
    id,
    stats: getFreshStats(),
    label,
    type: 'path',
    segments: [],
    closed: false,
  };

  let leftOver = definition.replace(/[Zz]\s*$/, () => {
    path.closed = true;
    return '';
  });

  // parse all segment definitions
  const segments: PathSegment[] = [];
  leftOver = leftOver.replace(/(?<cmd>[MLHVCSQTAmlhvcsqta])(?<segment>[\d\se\-.,]+)?/g, (_, cmd, segment) => {
    const previousSegment = segments.at(-1);
    segments.push(parseSegmentDefinition({ cmd, definition: segment, previousSegment }));
    return '';
  });

  // make sure all parts of the definition were successfully parsed (string should be empty)
  if (leftOver.length > 0) {
    throw new Error(`Unknown part "${leftOver}" in path definition "${definition}"`);
  }

  path.segments = segments;
  return path;
}

function parseSegmentDefinition({
  cmd,
  definition,
  previousSegment,
}: {
  cmd: string;
  definition: string;
  previousSegment?: PathSegment;
}): PathSegment {
  const args: number[] = definition
    .trim()
    .split(/[\s,]+/)
    .map((arg) => Number(arg));
  const props: ParseSegmentProps = { cmd, args, previousSegment };
  if (cmd.toUpperCase() === 'M') return parseM(props);
  if (cmd.toUpperCase() === 'L') return parseL(props);
  if (cmd.toUpperCase() === 'H') return parseH(props);
  if (cmd.toUpperCase() === 'V') return parseV(props);
  if (cmd.toUpperCase() === 'Q') return parseQ(props);
  if (cmd.toUpperCase() === 'T') return parseT(props);
  if (cmd.toUpperCase() === 'C') return parseC(props);
  if (cmd.toUpperCase() === 'S') return parseS(props);
  if (cmd.toUpperCase() === 'A') return parseA(props);
  throw new Error(`Invalid path definition "${cmd}${definition}", unknown path type "${cmd}"`);
}

interface ParseSegmentProps {
  cmd: string;
  args: number[];
  previousSegment?: PathSegment;
}

function parseM({ cmd, args, previousSegment }: ParseSegmentProps): LineSegment {
  // MOVE TO:
  // these segments are in the form "L x y"
  if (args.length !== 2) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 2 arguments expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[0], y: args[1], absolute: cmd === 'M', previousSegment });
  return { type: 'move', endPoint };
}

function parseL({ cmd, args, previousSegment }: ParseSegmentProps): LineSegment {
  // LINE:
  // these segments are in the form "L x y"
  if (args.length !== 2) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 2 arguments expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[0], y: args[1], absolute: cmd === 'L', previousSegment });
  return { type: 'line', endPoint };
}

function parseH({ cmd, args, previousSegment }: ParseSegmentProps): LineSegment {
  // HORIZONTAL LINE:
  // these segments are in the form "H x"
  if (args.length !== 1) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 1 argument expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[0], absolute: cmd === 'H', previousSegment });
  return { type: 'line', endPoint };
}

function parseV({ cmd, args, previousSegment }: ParseSegmentProps): LineSegment {
  // VERTICAL LINE:
  // these segments are in the form "V y"
  if (args.length !== 1) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 1 argument expected`);
  }
  const endPoint = getAbsoluteCoordinate({ y: args[0], absolute: cmd === 'V', previousSegment });
  return { type: 'line', endPoint };
}

function parseQ({ cmd, args, previousSegment }: ParseSegmentProps): QuadraticCurveSegment {
  // QUADRATIC BEZIER CURVE:
  // these segments are in the form "Q x1 y1 x y"
  if (args.length !== 4) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 4 arguments expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[2], y: args[3], absolute: cmd === 'Q', previousSegment });
  const cp = getAbsoluteCoordinate({ x: args[0], y: args[1], absolute: cmd === 'Q', previousSegment });
  return { type: 'quadraticCurve', smooth: false, cp, endPoint };
}

function parseT({ cmd, args, previousSegment }: ParseSegmentProps): QuadraticCurveSegment {
  // QUADRATIC BEZIER CURVE (smooth):
  // these segments are in the form "T x y", the control point is defined by the previous segment
  if (args.length !== 2) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 2 arguments expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[0], y: args[1], absolute: cmd === 'T', previousSegment });
  return { type: 'quadraticCurve', smooth: true, endPoint };
}

function parseC({ cmd, args, previousSegment }: ParseSegmentProps): CubicCurveSegment {
  // CUBIC BEZIER CURVE:
  // these segments are in the form "C x1 y1 x2 y2 x y"
  if (args.length !== 6) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 6 arguments expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[4], y: args[5], absolute: cmd === 'C', previousSegment });
  const cp1 = getAbsoluteCoordinate({ x: args[0], y: args[1], absolute: cmd === 'C', previousSegment });
  const cp2 = getAbsoluteCoordinate({ x: args[2], y: args[3], absolute: cmd === 'C', previousSegment });
  return { type: 'cubicCurve', smooth: false, cp1, cp2, endPoint };
}

function parseS({ cmd, args, previousSegment }: ParseSegmentProps): CubicCurveSegment {
  // CUBIC BEZIER CURVE (smooth):
  // these segments are in the form "S x2 y2 x y", the first control point is defined by the previous segment
  if (args.length !== 4) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 4 arguments expected`);
  }
  const endPoint = getAbsoluteCoordinate({ x: args[2], y: args[3], absolute: cmd === 'S', previousSegment });
  const cp2 = getAbsoluteCoordinate({ x: args[0], y: args[1], absolute: cmd === 'S', previousSegment });
  return { type: 'cubicCurve', smooth: true, cp2, endPoint };
}

function parseA({ cmd, args, previousSegment }: ParseSegmentProps): PathSegment {
  // ARC:
  // these segments are in the form "A rx ry rot large-flag sweep-flag"
  if (args.length !== 7) {
    throw new Error(`Invalid path definition "${cmd}", got ${args.join(' ')}, 7 arguments expected`);
  }
  return {
    type: 'arc',
    endPoint: getAbsoluteCoordinate({ x: args[5], y: args[6], absolute: cmd === 'A', previousSegment }),
    radiusX: args[0],
    radiusY: args[1],
    rotation: args[2],
    largeFlag: args[3] === 1,
    sweepFlag: args[4] === 1,
  };
}

function getAbsoluteCoordinate({
  x,
  y,
  absolute,
  previousSegment,
}: {
  x?: Length;
  y?: Length;
  absolute: boolean;
  previousSegment?: PathSegment;
}): Coordinate {
  if (x === undefined && previousSegment === undefined) {
    throw new Error('Either x or previousSegment need to be set');
  }
  if (y === undefined && previousSegment === undefined) {
    throw new Error('Either y or previousSegment need to be set');
  }
  if (absolute) {
    return {
      x: x === undefined ? (previousSegment?.endPoint.x as number) : x,
      y: y === undefined ? (previousSegment?.endPoint.y as number) : y,
    };
  }
  if (previousSegment === undefined) {
    throw new Error('For relative coordinates, previousSegment need to be set');
  }
  const offset: Coordinate = { x: x || 0, y: y || 0 };
  return addCoordinates({ leftArg: previousSegment.endPoint, rightArg: offset });
}
