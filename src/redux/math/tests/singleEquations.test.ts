import { AppStore, makeStore } from '../../store';
import { addEquationToStore, initialMathStates } from './test.helper';
import { Equation, TokenType } from '../equationParsing';
import { compareResults } from './test.helper';

interface EquationParsingParams {
  input: string;
  tokenTypes: `${TokenType}`[];
  result: number | number[];
}

// token types
const o: `${TokenType}` = 'operator';
const n: `${TokenType}` = 'number';
const f: `${TokenType}` = 'function';
const c: `${TokenType}` = 'composition';

// token sequences
const non = [n, o, n]; // 1+1
const non2 = [n, o, n, o, n]; // 1+2+3
const non4 = [n, o, n, o, n, o, n, o, n]; // 1+2+3+4+5
const cnonc = [c, n, o, n, c]; // (1+2)
const nocnonc = [n, o, ...cnonc]; // 1*(2+3)
const ncncn = [n, c, n, c, n]; // 1,2,3
const ncnoncn = [n, c, n, o, n, c, n]; // 1,2+3,4
const nocononc = [n, o, c, o, n, o, n, c]; // 1*(-2+3)
const fcnc = [f, c, n, c]; // sqrt(1)
const array3 = [f, c, ...ncncn, c]; // [1,2,3]

const testEquations: EquationParsingParams[] = [
  // simple addition and subtraction
  { input: '1+1', tokenTypes: non, result: 2 },
  { input: '3+21', tokenTypes: non, result: 24 },
  { input: '3-1', tokenTypes: non, result: 2 },
  { input: '3-21', tokenTypes: non, result: -18 },
  // longer sum
  { input: '1+2+3+4+5', tokenTypes: non4, result: 15 },
  // sub-result being zero (1+2-3)
  { input: '1+2-3+4-5', tokenTypes: non4, result: -1 },
  // include division
  { input: '1+4/2+4-5', tokenTypes: non4, result: 2 },
  // include multiplication
  { input: '1+4*2+4-5', tokenTypes: non4, result: 8 },
  { input: '6*5/3-5*2', tokenTypes: non4, result: 0 },
  // include parentheses
  { input: '20/(1+9)', tokenTypes: nocnonc, result: 2 },
  { input: '2*(2+8)', tokenTypes: nocnonc, result: 20 },
  { input: '2+(2-2)', tokenTypes: nocnonc, result: 2 },
  // include exponents
  { input: '3^2', tokenTypes: non, result: 9 },
  { input: '2^(2*5)', tokenTypes: nocnonc, result: 1024 },
  // ground level arrays: will be wrapped in array( ... )
  { input: '1,2,3', tokenTypes: array3, result: [1, 2, 3] },
  { input: '1,2*21,3', tokenTypes: [f, c, ...ncnoncn, c], result: [1, 42, 3] },
  // minus/plus as sign
  { input: '-1', tokenTypes: [n], result: -1 }, // this is directly parsed as a number (see 01_parseEquationInput)
  { input: '+1', tokenTypes: [n], result: 1 }, // this is directly parsed as a number (see 01_parseEquationInput)
  { input: '-1+1', tokenTypes: [o, ...non], result: 0 },
  { input: '-(-1)', tokenTypes: [o, c, o, n, c], result: 1 },
  { input: '3*(-10+5)', tokenTypes: nocononc, result: -15 },
  // non integer (sub)result
  { input: '3/1234*1234', tokenTypes: non2, result: 3 },
  { input: '1/3', tokenTypes: non, result: 0.3333333 },
  // functions
  { input: 'sqrt(2)', tokenTypes: fcnc, result: 1.4142135 },
  { input: 'sqrt(1+2/2)', tokenTypes: [f, c, ...non2, c], result: 1.4142135 },
  // arrays using [ ... ]
  { input: '[1,2,3]', tokenTypes: array3, result: [1, 2, 3] },
  { input: 'sqrt([1,4,9])', tokenTypes: [f, c, ...array3, c], result: [1, 2, 3] },
  { input: '3+[1,4,9]-7', tokenTypes: [n, o, ...array3, o, n], result: [-3, 0, 5] },
  { input: '[1,2,3]+[3,3,1]', tokenTypes: [...array3, o, ...array3], result: [4, 5, 4] },
  // implied multiplication
  { input: '3(2+1)', tokenTypes: nocnonc, result: 9 },
  { input: '3(2+1)2', tokenTypes: [...nocnonc, o, n], result: 18 },
  { input: '3(2+1)(2+1)', tokenTypes: [...nocnonc, o, ...cnonc], result: 27 },
  { input: '2sqrt(9)', tokenTypes: [n, o, ...fcnc], result: 6 },
];

describe.each<EquationParsingParams>(testEquations)(
  'Equation without variables: $input',
  ({ input, tokenTypes, result }) => {
    let store: AppStore;

    // test equation (variable A
    let equation: Equation | undefined;

    beforeEach(() => {
      store = makeStore({ math: initialMathStates.default });
      equation = addEquationToStore({ store, name: 'A', value: input });
    });

    it(`parses the equation into ${tokenTypes.length} tokens of the correct type`, () => {
      const tokens = equation?.tokens?.map((token) => token.type);
      expect(tokens).toEqual(['start', ...tokenTypes, 'end']);
    });

    it('does not detect errors for valid equations', () => {
      expect(equation?.errorMessage).toEqual(undefined);
    });

    it(`correctly computes the result: ${result}`, () => {
      const equationResult = equation?.result;
      compareResults({ result1: equationResult, result2: result });
    });
  },
);
