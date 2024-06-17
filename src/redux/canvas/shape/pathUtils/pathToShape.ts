import { Path } from '../path';
import { PathSegment } from './segmentTypes';

export function parsePathDefinition({
  id,
  label,
  definition,
}: {
  id: string;
  label: string;
  definition: string;
}): void {
  // check if the path is closed (Z at the end of the definition)
  const path: Path = {
    id,
    label,
    type: 'path',
    segments: [],
    closed: false,
  };
  let leftOver = definition.replace(/[Zz]\s$/, () => {
    path.closed = true;
    return '';
  });

  // parse all segment definitions
  const segments: PathSegment[] = [];
  leftOver = leftOver.replace(/(?<cmd>[MLHVCSQTAmlhvcsqta])(?<definition>[\d\se\-.,]+)?/g, (_, cmd, definition) => {
    segments.push(parseSegmentDefinition({ cmd, definition }));
    return '';
  });

  // make sure all parts of the definition were successfully parsed (string should be empty)
  if (leftOver.length > 0) {
    throw new Error(`Unknown part "${leftOver}" in path definition "${definition}"`);
  }

  path.segments = segments;
}

function parseSegmentDefinition({ cmd, definition }: { cmd: string; definition: string }): PathSegment {
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
      radiusX: args[0],
      radiusY: args[1],
      rotation: args[2],
      largeFlag: args[3] === 1,
      sweepFlag: args[4] === 1,
    };
  }
  throw new Error(`Invalid path definition "${cmd}${definition}", unknown path type "${cmd}"`);
}
