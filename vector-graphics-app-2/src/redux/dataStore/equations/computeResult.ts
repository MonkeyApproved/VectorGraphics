import { DataState } from '../dataSlice';
import { updateParentValues } from './dependencies';
import { Equation, setEquationError, setEquationResult } from './equation';
import { Arg, computeMathFunctionResult } from './mathFunctions';
import { TokenType } from './tokenEnums';
import { RpnToken } from './tokenTypes';
import { isValue } from './tokenUtils';

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
    if (isValue({ token })) {
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
