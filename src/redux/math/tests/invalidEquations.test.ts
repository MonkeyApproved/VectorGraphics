import { AppStore, makeStore } from '../../store';
import { equationContext, initialMathStates } from './test.helper';
import { addEquation } from '../slice';
import { getExistingEquation } from '../selectors';
import { Equation, MathFunction } from '../equationParsing';
import { equationError, tokenError } from '../equationParsing/errors';
import { FunctionToken, getFunctionToken } from '../equationParsing/tokenUtils';

interface InvalidSyntaxParams {
  input: string;
  expectedError: string;
  errorPosition?: number[]; // which tokens are affected
}

const sinFunction: MathFunction = { type: 'default', name: 'sin', minArgs: 1, maxArgs: 1 };
const sinToken: FunctionToken = getFunctionToken('sin', 5, sinFunction);
const tooManyArgsError = equationError.wrongNumberOfArgs({ token: { ...sinToken, nArgs: 2 } });
const insufficientArgsError = equationError.wrongNumberOfArgs({ token: { ...sinToken, nArgs: 0 } });

const testEquations: InvalidSyntaxParams[] = [
  // misplaced operators
  { input: '++1', expectedError: tokenError.sequence, errorPosition: [0, 1, 2] },
  { input: '1+', expectedError: tokenError.sequence, errorPosition: [2, 3] },
  { input: '1+1+', expectedError: tokenError.sequence, errorPosition: [4, 5] },
  { input: '3(^3)', expectedError: tokenError.sequence, errorPosition: [3, 4] }, // multiplication added in pos 2
  { input: '1+*2', expectedError: tokenError.sequence, errorPosition: [2, 3] },
  // missing/extra parentheses
  { input: '1+2)', expectedError: tokenError.openParenthesisMissing, errorPosition: [4] },
  { input: '1+(2', expectedError: tokenError.closeParenthesisMissing }, // error w/o position info
  { input: ')1+(2', expectedError: tokenError.closeParenthesisMissing, errorPosition: [1] },
  // misformed arrays
  { input: '[1,2]+[2,4', expectedError: tokenError.closeArrayMissing }, // error w/o position info
  { input: '1,2]+[2,4]', expectedError: tokenError.openArrayMissing, errorPosition: [6] }, // ground level comma
  { input: ']1,[2', expectedError: tokenError.closeArrayMissing, errorPosition: [1] },
  { input: '[1,2,,3]', expectedError: tokenError.sequence, errorPosition: [6, 7] },
  // parenthesis mixed with array brackets
  { input: '([1,2),3]', expectedError: tokenError.openArrayMissing, errorPosition: [7, 10] },
  { input: '[1,2)', expectedError: tokenError.misplacedParenthesis, errorPosition: [6] },
  // invalid function usage
  { input: 'sin(1,2)', expectedError: tooManyArgsError },
  { input: 'sin()', expectedError: insufficientArgsError },
  { input: 'sin', expectedError: tokenError.sequence, errorPosition: [1] },
  { input: '1+sin', expectedError: tokenError.sequence, errorPosition: [3] },
  // divide by zero
  { input: '1/0', expectedError: 'division by zero' },
  { input: '1/(2-2)', expectedError: 'division by zero' },
];

describe.each<InvalidSyntaxParams>(testEquations)(
  'Equations with invalid syntax: $input',
  ({ input, expectedError, errorPosition = [] }) => {
    let store: AppStore;
    let equation: Equation | undefined;
    const context = equationContext.variable_A;

    beforeEach(() => {
      store = makeStore({ math: initialMathStates.default });
      store.dispatch(addEquation({ context, value: input }));
      equation = getExistingEquation(context)(store.getState());
      expect(equation).toBeDefined();
    });

    it('detects an error for invalid equations', () => {
      expect(equation?.errorMessage).toBeDefined();
    });

    it('does not store any result', () => {
      expect(equation?.result).toBeUndefined();
    });

    it('stores the correct error message', () => {
      expect(equation?.errorMessage).toContain(expectedError);
    });

    it('marks the correct tokens as erroneous', () => {
      const errorTokens: number[] = [];
      equation?.tokens?.forEach((token, index) => {
        if (token.error) {
          errorTokens.push(index);
        }
      });
      expect(errorPosition).toEqual(errorTokens);
    });
  },
);
