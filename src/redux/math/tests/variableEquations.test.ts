import { AppStore, makeStore } from '../../store';
import { equationContext, initialMathStates } from './test.helper';
import { addEquation } from '../mathSlice';
import { getEquation } from '../selectors';
import { Equation } from '..';
import { TokenType } from '../equationParsing/tokenUtils';
import { compareResults } from './test.helper';

interface EquationParsingParams {
  input: string;
  tokenTypes: `${TokenType}`[];
  result: number | number[];
}

// token types
const v: `${TokenType}` = TokenType.Variable;
const o: `${TokenType}` = TokenType.Operator;
const n: `${TokenType}` = TokenType.Number;
const f: `${TokenType}` = TokenType.Function;
const c: `${TokenType}` = TokenType.Composition;

// token sequences
const vov = [v, o, v]; // A+B
const von = [v, o, n]; // A+1
const nov = [n, o, v]; // 1+A
const vov2 = [v, o, v, o, v]; // 1+2+3
const vov3 = [v, o, v, o, v, o, v]; // A+B+C+D
const cvovc = [c, v, o, v, c]; // (A+B)
const vocvovc = [v, o, ...cvovc]; // A*(B+C)
const fcvc = [f, c, v, c]; // sqrt(A)

const testEquations: EquationParsingParams[] = [
  // using single variable
  { input: 'A+1', tokenTypes: von, result: 2 },
  { input: '1-A', tokenTypes: nov, result: 0 },
  { input: 'C/2', tokenTypes: von, result: 2 },
  { input: 'C*2', tokenTypes: von, result: 8 },
  { input: 'C^2', tokenTypes: von, result: 16 },
  // using function
  { input: 'sqrt(C)', tokenTypes: fcvc, result: 2 },
  { input: 'sqrt C', tokenTypes: [f, v], result: 2 },
  // using 2 variables
  { input: 'A+B', tokenTypes: vov, result: 3 },
  { input: 'B-A', tokenTypes: vov, result: 1 },
  { input: 'C^B', tokenTypes: vov, result: 16 },
  // implied multiplication
  { input: 'C B', tokenTypes: vov, result: 8 },
  { input: 'B sqrt(C)', tokenTypes: [v, o, ...fcvc], result: 4 },
  // multiple variables
  { input: 'A+B*C', tokenTypes: vov2, result: 9 },
  { input: 'C*(A+A)', tokenTypes: vocvovc, result: 8 },
  { input: 'A+B-B/A', tokenTypes: vov3, result: 1 },
];

describe.each<EquationParsingParams>(testEquations)(
  'Equation with variables: $input (A=1, B=2, C=4)',
  ({ input, tokenTypes, result }) => {
    let store: AppStore;

    // fixed variables used in variable X
    const contextA = equationContext.variable_A;
    const contextB = equationContext.variable_B;
    const contextC = equationContext.variable_C;

    // test equation (variable X)
    let equationX: Equation | undefined;
    const contextX = equationContext.variable_X;

    beforeEach(() => {
      store = makeStore({ math: initialMathStates.default });
      store.dispatch(addEquation({ context: contextA, value: '1' }));
      store.dispatch(addEquation({ context: contextB, value: '2' }));
      store.dispatch(addEquation({ context: contextC, value: '4' }));
      store.dispatch(addEquation({ context: contextX, value: input }));
      equationX = getEquation(contextX)(store.getState());
      expect(equationX).toBeDefined();
    });

    it(`parses the equation into ${tokenTypes.length} tokens of the correct type`, () => {
      const tokens = equationX?.tokens?.map((token) => token.type);
      expect(tokens).toEqual(['start', ...tokenTypes, 'end']);
    });

    it('does not detect errors for valid equations', () => {
      expect(equationX?.errorMessage).toEqual(undefined);
    });

    it(`correctly computes the result: ${result}`, () => {
      const equationResult = equationX?.result;
      compareResults({ result1: equationResult, result2: result });
    });
  },
);
