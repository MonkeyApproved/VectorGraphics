import { DataState } from '../dataSlice';
import { updateElement } from '../svg/element';
import {
  collectDependentChildren,
  markCyclicDependency,
  removeEquationFromDependencyMap,
  updateDependencies,
  updateParentValues,
} from './dependencies';
import { Equation, getNewEquation, setEquationError, setEquationResult } from './equation';
import { Arg, computeMathFunctionResult } from './mathFunctions';
import getTokens from './parseEquation';
import getRPN from './reversePolishNotation';
import { TokenType } from './tokenEnums';
import { RpnToken } from './tokenTypes';
import { isValue } from './tokenUtils';

export function updateEquationInput({
  equationId,
  value,
  state,
}: {
  equationId: string;
  value: string | number;
  state: DataState;
}) {
  let equation: Equation = state.equations[equationId];
  if (!equation) {
    // equation with this id does not exist yet -> add new equation
    state.equations[equationId] = getNewEquation({ id: equationId });
    equation = state.equations[equationId];
  }

  if (typeof value == 'number') {
    // a number, not an equation (string) was passed -> only update lastValidNumber
    equation.lastValidNumber = value;
    return;
  }

  // if a real equation is passed, we evaluate it and also resolve all dependencies
  equation.input = value;
  equation.errorMessage = undefined;

  // parse equation
  getTokens({ equation });
  getRPN({ equation });
  updateDependencies({ equation, state }); // check for new or deprecated parents

  // compute result of equation and all modified children
  computeAllResults({ equationId, state });
}

export function computeAllResults({ equationId, state }: { equationId: string; state: DataState }) {
  const dependencyMap = collectDependentChildren({ dependencyMap: {}, equationId, state });
  const affectedSvgElements = new Set<string>();
  if (dependencyMap[equationId]) {
    // the equation depends on itself -> cyclic dependency, meaning none of the equations can be resolved.
    markCyclicDependency({ dependencyMap, state });
    return;
  }

  let equationReadyForEvaluation: string | undefined = equationId;
  while (equationReadyForEvaluation !== undefined) {
    // evaluate the equation that has no more unresolved dependencies
    const equation = computeEquationResult({ equationId: equationReadyForEvaluation, state });

    // remember all affected svg elements, so that they can be updated at the end
    equation.dependencies.svgUsage?.forEach((property) => affectedSvgElements.add(property.elementId));

    // remove said equation from dependency map and find next equation ready for evaluation
    equationReadyForEvaluation = removeEquationFromDependencyMap({
      dependencyMap,
      equationId: equationReadyForEvaluation,
    });
  }

  // update all dependent svg elements
  affectedSvgElements.forEach((elementId) => updateElement({ elementId, state }));

  // check if all equation have been evaluated (resulting in an empty dependency map)
  if (Object.keys(dependencyMap).length !== 0) {
    markCyclicDependency({ dependencyMap, state });
  }
}

export function computeEquationResult({ equationId, state }: { equationId: string; state: DataState }): Equation {
  /** Takes a reversed polish notation (RPN) as input and calculates the resulting value.
   *
   *  In RPN the equation '1+2/3' is stored as RPN: [1,3,2,'div','add']. Additionally we have a stack: []
   *  To calculate the final value we always take the first element of the RPN and act depending on type:
   *    item is number/variable     ->  move onto stack
   *    item is operator/function   ->  take N numbers from the stack (N = number of args of func)
   *                                    and evaluate function, put result on stack
   *
   *  For the example above this looks like:
   *     RPN: [1,3,2,'div','add']    stack: []
   *     RPN: [3,2,'div','add']      stack: [1]
   *     RPN: [2,'div','add']        stack: [1,3]
   *     RPN: ['div','add']          stack: [1,3,2]
   *             evaluate: div(2,3)
   *     RPN: ['add']                stack: [1,0.666]
   *             evaluate: add(0.666,1)
   *     RPN: []                     stack: [1.666] <- result
   *
   *  If there is exactly one number left on the stack at the end, this is the result.
   *  If there are multiple items left, the equation is not mathematically correct!
   **/
  const equation = state.equations[equationId];

  // check if equation has a rpn, indicating, that there was no error until this point.
  if (!equation) throw new Error(`Unknown equation "${equationId}"`);
  if (!equation.rpn) return equation;
  equation.errorMessage = undefined;

  updateParentValues({ equation, state });

  const stack: RpnToken[] = [];
  const rpn = [...equation.rpn];
  while (rpn.length > 0) {
    const token = rpn.pop() as RpnToken;
    if (isValue(token)) {
      stack.push(token);
    } else if (token.type === TokenType.Operator || token.type === TokenType.Function) {
      if (token.nArgs > token.maxArgs || token.nArgs < token.minArgs) {
        // invalid number of arguments
        const error_details = `Got ${token.nArgs}, expected ${token.minArgs}`;
        return setEquationError({
          equation,
          errorMessage: `Invalid number of arguments for "${token.name}". ${error_details}.`,
        });
      }
      if (token.nArgs > stack.length) {
        // error in calculation -> insufficient number of tokens on stack
        return setEquationError({
          equation,
          errorMessage: `Unknown error occurred at "${token.name}" calculating result.`,
        });
      }
      const args: Arg[] = [];
      while (args.length < token.nArgs) {
        const arg = stack.pop();
        if (!arg) {
          return setEquationError({
            equation,
            errorMessage: `Unknown error occurred at "${token.name}" calculating result.`,
          });
        } else if (!arg.value) {
          return setEquationError({
            equation,
            errorMessage: `Variable "${arg.symbol}" has no value.`,
          });
        }
        args.unshift(arg.value);
      }
      const result = computeMathFunctionResult({ funcName: token.name, args });
      if (!result || typeof result === 'string') {
        return setEquationError({
          equation,
          errorMessage: `Invalid equation.`,
        });
      }
      token.value = result;
      stack.push(token);
    }
  }

  if (stack.length !== 1) {
    return setEquationError({
      equation,
      errorMessage: `Invalid equation.`,
    });
  }
  setEquationResult({ equation, result: stack[0].value });
  return equation;
}
