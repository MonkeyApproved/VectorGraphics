import { Equation } from './types';
import { MathState } from '../slice';
import { getEquation } from './getEquation';
import { TokenType } from './tokenUtils';
import { UNKNOWN_CONTEXT_TYPE } from './unknownReference';

export interface DependencyErrors {
  unknownReferences: string[]; // unknown equation
  undefinedReferences: string[]; // existing equation, but value is undefined
}

export default function resolveDependencies({
  equation,
  state,
}: {
  equation: Equation;
  state: MathState;
}): DependencyErrors {
  if (!equation.rpn) return { unknownReferences: [], undefinedReferences: [] };

  const errors: DependencyErrors = { undefinedReferences: [], unknownReferences: [] };

  equation.rpn.forEach((token) => {
    if (token.type === TokenType.Variable || token.type === TokenType.Cell) {
      const parentContext = equation.dependencies.parents.find((parent) => parent.name === token.name);
      if (!parentContext) {
        // this should not happen, as the parents should have been updated in 05_updateDependencies
        throw new Error(`Parent dependencies seem to be out-of-date, context of ${token.name} not found`);
      } else if (parentContext.type === UNKNOWN_CONTEXT_TYPE) {
        // this variable is unknown, the equation result cannot be calculated
        errors.unknownReferences.push(parentContext.name);
      } else {
        const equation = getEquation({ context: parentContext, state });
        if (!equation) {
          // this should not happen, as unknown equations should have the UNKNOWN_CONTEXT_TYPE
          throw new Error(`Unknown error: Equation with id ${parentContext.name} does not exist`);
        }
        if (equation.result === undefined) {
          errors.undefinedReferences.push(parentContext.name);
        } else {
          token.value = equation.result;
        }
      }
    }
  });
  return errors;
}
