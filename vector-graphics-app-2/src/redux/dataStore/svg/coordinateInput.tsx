import { EquationDict, getEquationResultAsNumber } from '../equations/equation';
import { Coordinate } from './coordinate';
import { BaseElement } from './element';

export interface NumberInput {
  type: 'equation' | 'number';
  currentValue?: number;
  lastValidValue?: number;
  equationId?: string;
}

export interface CoordinateInput {
  x: NumberInput;
  y: NumberInput;
}

export function numberInputToValue({
  numberInput,
  equationDict,
}: {
  numberInput: NumberInput;
  equationDict: EquationDict;
}): number | undefined {
  if (numberInput.type === 'number') {
    // the number is defined with a raw number input -> return the current or last valid value
    return numberInput.currentValue || numberInput.lastValidValue;
  } else if (numberInput.type === 'equation' && numberInput.equationId) {
    // if the user used an equation, we try to evaluate this equation as a number
    return getEquationResultAsNumber({ equationId: numberInput.equationId, equationDict });
  }
  return undefined;
}

export function coordinateInputToCoordinate({
  coordinateInput,
  equationDict,
}: {
  coordinateInput: CoordinateInput;
  equationDict: EquationDict;
}): Coordinate {
  const x = numberInputToValue({ numberInput: coordinateInput.x, equationDict });
  const y = numberInputToValue({ numberInput: coordinateInput.y, equationDict });
  return {
    x: x || NaN,
    y: y || NaN,
  };
}

export function getElementPositionFromInput({
  element,
  equationDict,
}: {
  element: BaseElement;
  equationDict: EquationDict;
}): Coordinate | undefined {
  if (!element.positionInput) {
    return undefined;
  }
  return coordinateInputToCoordinate({ coordinateInput: element.positionInput, equationDict });
}

export function getElementSizeFromInput({
  element,
  equationDict,
}: {
  element: BaseElement;
  equationDict: EquationDict;
}): Coordinate | undefined {
  if (!element.sizeInput) {
    return undefined;
  }
  return coordinateInputToCoordinate({ coordinateInput: element.sizeInput, equationDict });
}
