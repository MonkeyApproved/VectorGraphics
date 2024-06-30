import { Arg } from './functionUtils/functionTypes';
import { computeMathFunctionResult } from './functionUtils/utils';
import { TokenType } from './tokenUtils/tokenEnums';
import { RpnToken } from './tokenUtils/tokenTypes';
import { isValue } from './tokenUtils/tokenUtils';
import {
  DependencyMap,
  incrementVersions,
  markCyclicDependency,
  removeContextFromDependencyMap,
} from './06_dependencyMap';
import { setEquationResult } from './result';
import { MathState } from '../slice';
import { Equation } from './types';
import { Context } from '../context';
import { getEquation } from './getEquation';
import resolveDependencies from './08_resolveDependencies';
import { equationError, setEquationError } from './errors';

export default function computeAllResults({
  context,
  dependencyMap,
  state,
}: {
  context: Context;
  dependencyMap: DependencyMap;
  state: MathState;
}) {
  // first, we update the versions of all affected equations & namespaces
  // this ensures, that all consuming components are re-rendered
  incrementVersions({ dependencyMap, state });

  let equationReadyForEvaluation: Context | undefined = context;
  while (equationReadyForEvaluation !== undefined) {
    // evaluate the equation that has no more unresolved dependencies
    computeEquationResult({ context: equationReadyForEvaluation, state });

    // remove said equation from dependency map and find next equation ready for evaluation
    equationReadyForEvaluation = removeContextFromDependencyMap({
      dependencyMap,
      context: equationReadyForEvaluation,
    });
  }

  // check if all equation have been evaluated (resulting in an empty dependency map)
  if (Object.keys(dependencyMap).length !== 0) {
    markCyclicDependency({ dependencyMap, state });
  }
}

export function computeEquationResult({ context, state }: { context: Context; state: MathState }): Equation {
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
  const equation = getEquation({ context, state });

  // check if equation has a rpn, indicating, that there was no error until this point.
  if (!equation) throw new Error(`Unknown equation "${context.name}"`);
  if (!equation.rpn || equation.rpn.length === 0) return equation;
  equation.errorMessage = undefined;

  const dependencyErrors = resolveDependencies({ equation, state });
  // in case of any unknown or undefined variables, we cannot compute the result
  if (dependencyErrors?.unknownReferences.length > 0) {
    return setEquationError({
      equation,
      errorMessage: equationError.unknownVariables({ unknownVariables: dependencyErrors.unknownReferences }),
    });
  } else if (dependencyErrors?.undefinedReferences.length > 0) {
    return setEquationError({
      equation,
      errorMessage: equationError.undefinedVariables({ undefinedVariables: dependencyErrors.undefinedReferences }),
    });
  }

  // after all checks have been cleared, we can now use the RPN to compute the final result
  const stack: RpnToken[] = [];
  const rpn = [...equation.rpn];
  while (rpn.length > 0) {
    const token = rpn.pop() as RpnToken;
    if (isValue({ token })) {
      stack.push(token);
    } else if (token.type === TokenType.Operator || token.type === TokenType.Function) {
      const tokenName = token.definition.name;
      if (token.nArgs > token.definition.maxArgs || token.nArgs < token.definition.minArgs) {
        // invalid number of arguments
        return setEquationError({ equation, errorMessage: equationError.wrongNumberOfArgs({ token }) });
      }
      if (token.nArgs > stack.length) {
        return setEquationError({
          equation,
          errorMessage: equationError.wrongNumberOfArgs({ token, nArgs: stack.length }),
        });
      }
      const args: Arg[] = [];
      while (args.length < token.nArgs) {
        const arg = stack.pop();
        if (!arg || arg.value === undefined) {
          // this should have been caught before in th nArgs.length check or in resolveDependencies()
          throw new Error(`Unknown argument error occurred at "${tokenName}".`);
        }
        args.unshift(arg.value);
      }
      const result = computeMathFunctionResult({ func: token.definition, args });
      if (typeof result === 'string') {
        return setEquationError({ equation, errorMessage: result });
      }
      token.value = result;
      stack.push(token);
    }
  }

  if (stack.length !== 1) {
    return setEquationError({ equation, errorMessage: `Invalid equation.` });
  }
  setEquationResult({ equation, result: stack[0].value });
  return equation;
}
