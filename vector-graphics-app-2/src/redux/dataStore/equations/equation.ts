import { concatCamelCase } from 'generalHelpers/stringHelper';
import { DataState } from '../dataSlice';
import { Coordinate, CoordinateEquations } from '../svg/coordinate';
import { NumberProperty } from '../svg/element';
import { Dependencies } from './dependencies';
import { RpnToken, Token } from './tokenTypes';

export type Result = number | number[] | undefined;

export interface Equation {
  id: string;
  input?: string;
  dependencies: Dependencies;
  tokens?: Token[];
  errorMessage?: string;
  rpn?: RpnToken[];
  result?: Result;
  lastValidNumber?: number;
}

export function getNewEquation({ id, input }: { id: string; input?: string }): Equation {
  return { id, input, dependencies: { children: [], parents: [] } };
}

export function getSvgPropertyEquationId({ property }: { property: NumberProperty }): string {
  if (property.dimension) {
    return concatCamelCase({ stringList: [property.elementId, property.type, property.dimension] });
  }
  return concatCamelCase({ stringList: [property.elementId, property.type] });
}

export function getNewSvgPropertyEquation({
  property,
  initialValue,
}: {
  property: NumberProperty;
  initialValue: number;
}): Equation {
  return {
    id: getSvgPropertyEquationId({ property }),
    dependencies: { children: [], parents: [], svgUsage: [property] },
    input: `${initialValue}`,
    result: initialValue,
    lastValidNumber: initialValue,
  };
}

export interface EquationDict {
  [id: string]: Equation;
}

export function addSvgPropertyEquation({
  property,
  initialValue,
  state,
}: {
  property: NumberProperty;
  initialValue: number;
  state: DataState;
}): string {
  const equation = getNewSvgPropertyEquation({ property, initialValue });
  state.equations[equation.id] = equation;
  return equation.id;
}

export function setEquationError({ equation, errorMessage }: { equation: Equation; errorMessage: string }) {
  equation.errorMessage = errorMessage;
  equation.result = undefined;
  return equation;
}

export function setEquationResult({ equation, result }: { equation: Equation; result: Result }) {
  equation.result = result;
  if (typeof result === 'number') {
    equation.lastValidNumber = result;
  }
}

export function getNumber({ equationId, state }: { equationId: string; state: DataState }): number {
  const equation = state.equations[equationId];
  return equation?.lastValidNumber || NaN;
}

export function getCoordinate({
  coordinateEquations,
  state,
}: {
  coordinateEquations: CoordinateEquations;
  state: DataState;
}): Coordinate {
  return {
    x: getNumber({ equationId: coordinateEquations.x, state }),
    y: getNumber({ equationId: coordinateEquations.y, state }),
  };
}
