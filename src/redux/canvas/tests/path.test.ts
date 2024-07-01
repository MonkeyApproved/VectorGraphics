import { Path, PathSegment, PathSegmentTypes, getSvgShapeParams, pathToShape } from '../shape';
import { Coordinate } from '../types';

const l: PathSegmentTypes = 'line';
const m: PathSegmentTypes = 'move';
const q: PathSegmentTypes = 'quadraticCurve';
const c: PathSegmentTypes = 'cubicCurve';
const a: PathSegmentTypes = 'arc';

// absolute point representations
const move10 = 'M 10 11';
const p20String = '20 21';
const p30String = '30 31';
const p40String = '40 41';
// relative point representations
const p20RelString = '30 32';
const p30RelString = '40 42';
const p40RelString = '50 52';

// absolute points
const p10: Coordinate = { x: 10, y: 11 };
const p20: Coordinate = { x: 20, y: 21 };
const p30: Coordinate = { x: 30, y: 31 };
const p40: Coordinate = { x: 40, y: 41 };
// relative points
const p20Rel: Coordinate = { x: 20 + 10, y: 21 + 11 };
const p30Rel: Coordinate = { x: 30 + 10, y: 31 + 11 };
const p40Rel: Coordinate = { x: 40 + 10, y: 41 + 11 };

const moveSegment: Partial<PathSegment> = { type: m, endPoint: p10 };

interface SingleSegmentTest {
  d: string; // path definition to parse
  dFinal?: string; // how "d" is formatted by pathUtils (default: same as d)
  closed: boolean; // does the path end on a closing flag ("Z")
  segment: Partial<PathSegment>; // segment to test for
}

const singleSegmentTestCases: SingleSegmentTest[] = [
  // absolute paths
  {
    d: `${move10} L ${p20String}`,
    closed: false,
    segment: { type: l, endPoint: p20 },
  },
  {
    d: `${move10} L ${p20String} Z`,
    closed: true,
    segment: { type: l, endPoint: p20 },
  },
  {
    d: `${move10} M ${p20String}`,
    closed: false,
    segment: { type: m, endPoint: p20 },
  },
  {
    d: `${move10} H 42`,
    dFinal: `${move10} L 42 11`,
    closed: false,
    segment: { type: l, endPoint: { x: 42, y: 11 } },
  },
  {
    d: `${move10} V 42 Z`,
    dFinal: `${move10} L 10 42 Z`,
    closed: true,
    segment: { type: l, endPoint: { x: 10, y: 42 } },
  },
  {
    d: `${move10} Q ${p20String} ${p30String}`,
    closed: false,
    segment: { type: q, smooth: false, cp: p20, endPoint: p30 },
  },
  {
    d: `${move10} T ${p30String}`,
    closed: false,
    segment: { type: q, smooth: true, endPoint: p30 },
  },
  {
    d: `${move10} C ${p20String} ${p30String} ${p40String} Z`,
    closed: true,
    segment: { type: c, smooth: false, endPoint: p40, cp1: p20, cp2: p30 },
  },
  {
    d: `${move10} S ${p30String} ${p40String}`,
    closed: false,
    segment: { type: c, smooth: true, endPoint: p40, cp2: p30 },
  },
  {
    d: `${move10} A 5 5 0 1 0 ${p20String}`,
    closed: false,
    segment: { type: a, endPoint: p20, radiusX: 5, radiusY: 5, rotation: 0, largeFlag: true, sweepFlag: false },
  },
  // relative paths
  {
    d: `${move10} l ${p20String}`,
    dFinal: `${move10} L ${p20RelString}`,
    closed: false,
    segment: { type: l, endPoint: p20Rel },
  },
  {
    d: `${move10} l ${p20String} Z`,
    dFinal: `${move10} L ${p20RelString} Z`,
    closed: true,
    segment: { type: l, endPoint: p20Rel },
  },
  {
    d: `${move10} h 42`,
    dFinal: `${move10} L 52 11`,
    closed: false,
    segment: { type: l, endPoint: { x: 52, y: 11 } },
  },
  {
    d: `${move10} v 42 Z`,
    dFinal: `${move10} L 10 53 Z`,
    closed: true,
    segment: { type: l, endPoint: { x: 10, y: 53 } },
  },
  {
    d: `${move10} q ${p20String} ${p30String}`,
    dFinal: `${move10} Q ${p20RelString} ${p30RelString}`,
    closed: false,
    segment: { type: q, smooth: false, cp: p20Rel, endPoint: p30Rel },
  },
  {
    d: `${move10} q -10 10 20 -20`,
    dFinal: `${move10} Q 0 21 30 -9`,
    closed: false,
    segment: { type: q, smooth: false, cp: { x: 0, y: 21 }, endPoint: { x: 30, y: -9 } },
  },
  {
    d: `${move10} t ${p30String}`,
    dFinal: `${move10} T ${p30RelString}`,
    closed: false,
    segment: { type: q, smooth: true, endPoint: p30Rel },
  },
  {
    d: `${move10} c ${p20String} ${p30String} ${p40String} Z`,
    dFinal: `${move10} C ${p20RelString} ${p30RelString} ${p40RelString} Z`,
    closed: true,
    segment: { type: c, smooth: false, endPoint: p40Rel, cp1: p20Rel, cp2: p30Rel },
  },
  {
    d: `${move10} s ${p30String} ${p40String}`,
    dFinal: `${move10} S ${p30RelString} ${p40RelString}`,
    closed: false,
    segment: { type: c, smooth: true, endPoint: p40Rel, cp2: p30Rel },
  },
  {
    d: `${move10} a 5 5 0 1 0 ${p20String}`,
    dFinal: `${move10} A 5 5 0 1 0 ${p20RelString}`,
    closed: false,
    segment: { type: a, endPoint: p20Rel, radiusX: 5, radiusY: 5, rotation: 0, largeFlag: true, sweepFlag: false },
  },
];

describe.each<SingleSegmentTest>(singleSegmentTestCases)(
  'Parsing single segment from path "d": $d',
  ({ d, dFinal, closed, segment }) => {
    const id = 'path_0';
    const label = 'test label';
    let shape: Path;

    beforeEach(() => {
      shape = pathToShape({ id, label, definition: d });
    });

    it('correctly parses the closed flag ("Z")', () => {
      expect(shape.closed).toStrictEqual(closed);
    });

    it('correctly parses the single segment', () => {
      // first one is always "M 10 10" and the 2nd one changes
      expect(shape.segments).toHaveLength(2);
      expect(shape.segments[0]).toMatchObject(moveSegment);
      expect(shape.segments[1]).toMatchObject(segment);
    });

    it('correctly reconstructs the original path definition "d"', () => {
      const shapeAttr = getSvgShapeParams({ shape });
      expect(shapeAttr).toHaveProperty('d');
      expect(shapeAttr['d']).toStrictEqual(dFinal || d);
    });
  },
);

interface ComplexPathTest {
  d: string; // path definition to parse
  onlyAbsolute: boolean; // if d only contains absolute commands, we can check the generated definition
  segments: PathSegmentTypes[]; // expected segment types
}

const complexPathTestCases: ComplexPathTest[] = [
  {
    d: 'M 40 80 L 100 10 L 130 0 L 120 30 L 50 90 C 60 100 60 110 70 100 C 70 110 80 120 70 120 A 14.2 14.2 90 0 1 60 130 A 50 50 90 0 0 40 100 Q 35 99 35 105 T 20 118 T 12 110 T 25 95 T 30 90 A 50 50 90 0 0 0 70 A 14.2 14.2 90 0 1 10 60 C 10 50 20 60 30 60 C 20 70 30 70 40 80 M 100 10 L 100 30 L 120 30 L 102 28 L 100 10',
    onlyAbsolute: true,
    segments: [m, l, l, l, l, c, c, a, a, q, q, q, q, q, a, a, c, c, m, l, l, l, l],
  },
  {
    d: 'M 40 80 l 100 10 C 60 100 60 110 70 100 c 10 10 20 20 20 1.1 s 10 10 -20 -50 t -10 19 a 14.2 14.2 90 0 1 30 -30 L 10 10 l 90 90 h -40 v -50 Z',
    onlyAbsolute: false,
    segments: [m, l, c, c, c, q, a, l, l, l, l],
  },
];

describe.each<ComplexPathTest>(complexPathTestCases)(
  'Parsing complex path "d": $d',
  ({ d, onlyAbsolute, segments }) => {
    const id = 'path_0';
    const label = 'test label';
    let shape: Path;

    beforeEach(() => {
      shape = pathToShape({ id, label, definition: d });
    });

    it('correctly parses the correct segment types', () => {
      expect(shape.segments.map((s) => s.type)).toEqual(segments);
    });

    it('correctly reconstructs the original path definition "d"', () => {
      const shapeAttr = getSvgShapeParams({ shape });
      expect(shapeAttr).toHaveProperty('d');
      if (onlyAbsolute) {
        expect(shapeAttr['d']).toStrictEqual(d);
      }
    });
  },
);
