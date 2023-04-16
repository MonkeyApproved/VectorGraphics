import { BaseElement } from './element';
import { CoordinatePixels, addCoordinates, getCoordinatePixels } from './coordinate';
import { DataState } from '../dataSlice';
import { forEachElement } from './elementDict';

export interface Area {
  position: CoordinatePixels;
  size: CoordinatePixels;
}

export function getElementArea({ element, state }: { element: BaseElement; state: DataState }): Area {
  return {
    position: getCoordinatePixels({ coordinate: element.position, state }),
    size: getCoordinatePixels({ coordinate: element.size, state }),
  };
}

export function getAreaContainingCoordinates({ coordinateList }: { coordinateList: CoordinatePixels[] }): Area {
  if (coordinateList.length === 0) throw new Error('Cannot calculate area for empty list of elements');
  const xPositions = coordinateList.map((coordinate) => coordinate.x);
  const yPositions = coordinateList.map((coordinate) => coordinate.y);
  const xMin = Math.min(...xPositions);
  const xMax = Math.max(...xPositions);
  const yMin = Math.min(...yPositions);
  const yMax = Math.max(...yPositions);
  return {
    position: { x: xMin, y: yMin },
    size: { x: xMax - xMin, y: yMax - yMin },
  };
}

export function isAreaContainedWithinArea({ innerArea, outerArea }: { innerArea: Area; outerArea: Area }): boolean {
  // check upper left corner of areas
  if (innerArea.position.x < outerArea.position.x || innerArea.position.y < outerArea.position.y) {
    return false;
  }
  // check bottom right corner of areas
  const innerBottomRight = addCoordinates({ leftArg: innerArea.position, rightArg: innerArea.size });
  const outerBottomRight = addCoordinates({ leftArg: outerArea.position, rightArg: outerArea.size });
  if (innerBottomRight.x > outerBottomRight.x || innerBottomRight.y > outerBottomRight.y) {
    return false;
  }
  return true;
}

export function getAllElementsWithinArea({ area, state }: { area: Area; state: DataState }): string[] {
  const elementList: string[] = [];
  forEachElement({
    dict: state.svg.elementDict,
    func: (element) => {
      const elementArea = getElementArea({ element, state });
      if (isAreaContainedWithinArea({ outerArea: area, innerArea: elementArea })) {
        elementList.push(element.id);
      }
    },
  });
  return elementList;
}

export function getMinimumAreaContainingAllElements({
  elementIds,
  state,
}: {
  elementIds: string[];
  state: DataState;
}): Area {
  // we take the top-left and bottom-right corner of all the elements and find the rect that contains all those points
  const coordinateList: CoordinatePixels[] = [];
  elementIds.forEach((id) => {
    const area = getElementArea({ element: state.svg.elementDict[id], state });
    const bottomRight = addCoordinates({ leftArg: area.position, rightArg: area.size });
    coordinateList.push(area.position, bottomRight);
  });
  return getAreaContainingCoordinates({ coordinateList });
}
