import { Coordinate } from '../../types';
import { Path } from '../path';
import { PathSegment } from './segmentTypes';

export function getPathDefinition({ shape }: { shape: Path }): string {
  const segment = shape.segments.map((segment) => getSegmentString({ segment })).join(' ');
  if (shape.closed) {
    return segment + ' Z';
  }
  return segment;
}

function getSegmentString({ segment }: { segment: PathSegment }): string {
  const cmd = formatSegmentCmd({ segment });
  const endPoint = formatCoordinate({ coordinate: segment.endPoint });
  const additional = formatControlPoint({ segment });
  return cmd + additional + endPoint;
}

function formatSegmentCmd({ segment }: { segment: PathSegment }): string {
  let lowerCase = segment.type.charAt(0);
  if (segment.type === 'cubicCurve' && segment.smooth) lowerCase = 's';
  if (segment.type === 'quadraticCurve' && segment.smooth) lowerCase = 't';
  return segment.absolute ? lowerCase.toUpperCase() : lowerCase;
}

function formatCoordinate({ coordinate }: { coordinate: Coordinate | undefined }): string {
  if (coordinate === undefined) return '';
  return `${coordinate.x} ${coordinate.y}`;
}

function formatControlPoint({ segment }: { segment: PathSegment }): string {
  switch (segment.type) {
    case 'line':
    case 'move':
      return '';
    case 'quadraticCurve':
      return formatCoordinate({ coordinate: segment.cp });
    case 'cubicCurve': {
      const cp1 = formatCoordinate({ coordinate: segment.cp1 });
      const cp2 = formatCoordinate({ coordinate: segment.cp2 });
      return `${cp1}${cp2}`;
    }
    case 'arc': {
      const radius = `${segment.radiusX} ${segment.radiusY}`;
      const rot = segment.rotation;
      const flags = `${Number(segment.largeFlag)} ${Number(segment.sweepFlag)}`;
      return `${radius} ${rot} ${flags}`;
    }
  }
}
