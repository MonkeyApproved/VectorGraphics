import { concatCamelCase } from 'generalHelpers/stringHelper';
import { DataState } from '../dataSlice';
import { updateEquationInput } from './updateEquation';
import { getNewEquation } from './equation';
import { CoordinatePixels } from '../svg/coordinate';
import { applyElementPosition, applyElementSize } from '../svg/applyAttributes';
import { selectElementById } from '../svg/element';

export interface SvgProperty {
  elementId: string;
  type: 'position' | 'size';
  dimension: keyof CoordinatePixels;
}

export function getSvgPropertyEquationId({ property }: { property: SvgProperty }): string {
  if (property.dimension) {
    return concatCamelCase({ stringList: [property.elementId, property.type, property.dimension] });
  }
  return concatCamelCase({ stringList: [property.elementId, property.type] });
}

interface SvgPropertyFunctionProps {
  property: SvgProperty;
  value: string | number;
  lastValidNumber?: number;
  state: DataState;
}

export function updateSvgPropertyEquation({
  property,
  value,
  lastValidNumber,
  state,
}: SvgPropertyFunctionProps): string | number {
  const equationId = getSvgPropertyEquationId({ property });
  const numericValue = Number(value);

  if (typeof value === 'string' && isNaN(numericValue)) {
    // REAL EQUATION:
    // as this is not simply a number (or can be interpreted as a number), we assume this is an equation

    if (!state.equations[equationId]) {
      // make sure equation exists with correct dependency
      state.equations[equationId] = getNewEquation({ id: equationId });
      state.equations[equationId].dependencies.svgUsage = [property];
      if (lastValidNumber && !isNaN(lastValidNumber)) {
        state.equations[equationId].lastValidNumber = lastValidNumber;
      }
    }

    // update value and return equation id
    updateEquationInput({ equationId, value, state });
    return equationId;
  }

  // NUMERIC VALUE:
  // the current value can be interpreted as a number. Therefore no equation is needed
  const existingEquation = state.equations[equationId];

  if (!existingEquation) {
    // no corresponding equation exists, nothing else to do
    return numericValue;
  }

  // if this is the only dependency of the existing equation we can now safely remove it
  const dependencies = existingEquation.dependencies;
  if (dependencies.children.length === 0 && dependencies.svgUsage?.length === 1) {
    delete state.equations[equationId];
    return numericValue;
  }

  // as this equation has other dependencies, we maintain the equation and update it's value
  updateEquationInput({ equationId, value: numericValue, state });
  return numericValue;
}

export function updateSvgProperty({ property, value, lastValidNumber, state }: SvgPropertyFunctionProps) {
  const propertyValue = updateSvgPropertyEquation({ property, value, lastValidNumber, state });
  const element = state.svg.elementDict[property.elementId];
  const elementSelection = selectElementById({ elementId: element.id });
  if (property.type === 'position') {
    element.position[property.dimension] = propertyValue;
    applyElementPosition({ element, elementSelection, state });
  } else if (property.type === 'size') {
    element.size[property.dimension] = propertyValue;
    applyElementSize({ element, elementSelection, state });
  }
}

export function svgPropertyValue({ property, state }: Omit<SvgPropertyFunctionProps, 'value'>) {
  if (['position', 'size'].includes(property.type)) {
    return state.svg.elementDict[property.elementId][property.type][property.dimension];
  }
  return undefined;
}

export function svgPropertyValueType(props: Omit<SvgPropertyFunctionProps, 'value'>) {
  const value = svgPropertyValue(props);
  if (typeof value === 'string') return 'equation';
  return 'number';
}
