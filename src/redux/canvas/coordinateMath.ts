import { AnyShapeGeneric, Rect, ShapeArea } from './shape';
import { getRectArea } from './shape/rect';
import { Area, Coordinate } from './types';

interface CoordinateMathProps {
  leftArg: Coordinate;
  rightArg: Coordinate;
}

export function addCoordinates({ leftArg, rightArg }: CoordinateMathProps): Coordinate {
  return { x: leftArg.x + rightArg.x, y: leftArg.y + rightArg.y };
}

export function subtractCoordinates({ leftArg, rightArg }: CoordinateMathProps): Coordinate {
  return { x: leftArg.x - rightArg.x, y: leftArg.y - rightArg.y };
}

export function getAreaContainingCoordinates({ coordinateList }: { coordinateList: Coordinate[] }): Area {
  if (coordinateList.length === 0) throw new Error('Cannot calculate area for empty list of elements');
  const xPositions = coordinateList.map((coordinate) => coordinate.x);
  const yPositions = coordinateList.map((coordinate) => coordinate.y);
  const xMin = Math.min(...xPositions);
  const xMax = Math.max(...xPositions);
  const yMin = Math.min(...yPositions);
  const yMax = Math.max(...yPositions);
  return {
    position: { x: xMin, y: yMin },
    positionAnchor: 'top-left',
    size: { width: xMax - xMin, height: yMax - yMin },
  };
}

export function getAreaCenter({ area }: { area: Area }): Coordinate {
  return {
    x: area.position.x + area.size.width / 2,
    y: area.position.y + area.size.height / 2,
  };
}

export function pointDistance({ leftArg, rightArg }: CoordinateMathProps): number {
  return Math.sqrt((leftArg.x - rightArg.x) ** 2 + (leftArg.y - rightArg.y) ** 2);
}

export function valueWithMinMax({ value, min, max }: { value: number; min?: number; max?: number }): number;
export function valueWithMinMax({
  value,
  min,
  max,
}: {
  value: number | undefined;
  min?: number;
  max?: number;
}): number | undefined;
export function valueWithMinMax({
  value,
  min,
  max,
}: {
  value?: number;
  min?: number;
  max?: number;
}): number | undefined {
  if (value === undefined) return value;
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

export function isShapeAreaInRect({ shapeArea, rect }: { shapeArea: ShapeArea; rect: AnyShapeGeneric<Rect> }) {
  const rectArea = getRectArea({ shape: rect });
  return (
    shapeArea.minX > rectArea.minX &&
    shapeArea.maxX < rectArea.maxX &&
    shapeArea.minY > rectArea.minY &&
    shapeArea.maxY < rectArea.maxY
  );
}
