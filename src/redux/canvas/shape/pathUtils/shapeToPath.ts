import { AnyShapeGeneric } from '..';
import { Coordinate } from '../../types';
import { Path } from '../path';
import { PathSegment } from './segmentTypes';

export function shapeToPath({ shape }: { shape: AnyShapeGeneric<Path> }): string {
  const segments = shape.segments.map((segment) => getSegmentString({ segment }));
  if (shape.closed) {
    segments.push('Z');
  }
  return segments.join(' ');
}

function getSegmentString({ segment }: { segment: PathSegment }): string {
  const cmd = formatSegmentCmd({ segment });
  const endPoint = formatCoordinate({ coordinate: segment.endPoint });
  const additional = formatControlPoint({ segment });
  return `${cmd}${additional} ${endPoint}`;
}

function formatSegmentCmd({ segment }: { segment: PathSegment }): string {
  let cmd = segment.type.charAt(0);
  if (segment.type === 'cubicCurve' && segment.smooth) cmd = 's';
  if (segment.type === 'quadraticCurve' && segment.smooth) cmd = 't';
  return cmd.toUpperCase();
}

function formatCoordinate({ coordinate }: { coordinate: Coordinate | undefined }): string {
  if (coordinate === undefined) return '';
  return `${coordinate.x} ${coordinate.y}`;
}

function formatControlPoint({ segment }: { segment: PathSegment }): string {
  if (segment.type === 'line' || segment.type === 'move') {
    return '';
  } else if (segment.type === 'quadraticCurve') {
    if (segment.smooth) return '';
    const cp = formatCoordinate({ coordinate: segment.cp });
    return ` ${cp}`;
  } else if (segment.type === 'cubicCurve') {
    const cp2 = formatCoordinate({ coordinate: segment.cp2 });
    if (segment.smooth) return ` ${cp2}`;
    const cp1 = formatCoordinate({ coordinate: segment.cp1 });
    return ` ${cp1} ${cp2}`;
  } else if (segment.type === 'arc') {
    const radius = `${segment.radiusX} ${segment.radiusY}`;
    const rot = segment.rotation;
    const flags = `${Number(segment.largeFlag)} ${Number(segment.sweepFlag)}`;
    return ` ${radius} ${rot} ${flags}`;
  }
  throw new Error(`Invalid segment type ${segment.type}`);
}
