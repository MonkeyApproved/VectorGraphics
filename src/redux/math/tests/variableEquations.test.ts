import { AppStore, makeStore } from '../../store';
import { addEquationToStore, initialMathStates } from './test.helper';
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
  'Simple equation with variables: $input (A=1, B=2, C=4)',
  ({ input, tokenTypes, result }) => {
    let store: AppStore;

    // test equation (variable X)
    let equationX: Equation | undefined;

    beforeEach(() => {
      store = makeStore({ math: initialMathStates.default });
      addEquationToStore({ store, name: 'A', value: '1' });
      addEquationToStore({ store, name: 'B', value: '2' });
      addEquationToStore({ store, name: 'C', value: '4' });
      equationX = addEquationToStore({ store, name: 'X', value: input });
    });

    it(`parses the equation into ${tokenTypes.length} tokens of the correct type`, () => {
      const tokens = equationX?.tokens?.map((token) => token.type);
      expect(tokens).toEqual(['start', ...tokenTypes, 'end']);
    });

    it('does not detect errors for valid equations', () => {
      expect(equationX?.errorMessage).toEqual(undefined);
    });

    it(`correctly computes the result: ${result}`, () => {
      compareResults({ result1: equationX?.result, result2: result });
    });
  },
);

const complexTestEquations: Omit<EquationParsingParams, 'tokenTypes'>[] = [
  // using different nested functions
  { input: 'A*(12/(A-17)+sin(25))+cos(17/A)/sqrt(2)', result: -2.391558 },
  { input: '(sinh(A)-cosh(max(A*5,[4,22/A])))/(exp(4)+min(55,42,A*4))', result: -24542.703777 },
  { input: 'log2(282736)^( tanh(A) - sqrt(A*tan(A / (-5+8))))', result: 0.034095 },
  // vector equation, with 3rd element being complex (negative sqrt) and should result in NaN
  { input: 'cos([A,7,-A])+sqrt([4,A,-1]^3-sqrt([17,2A,6]))', result: [6.7480236, 5.7087494, NaN] },
];

describe.each<Omit<EquationParsingParams, 'tokenTypes'>>(complexTestEquations)(
  'Complex equation with single variable: $input (A=3)',
  ({ input, result }) => {
    let store: AppStore;

    // test equation (variable X)
    let equationX: Equation | undefined;

    beforeEach(() => {
      store = makeStore({ math: initialMathStates.default });
      addEquationToStore({ store, name: 'A', value: '3' });
      equationX = addEquationToStore({ store, name: 'X', value: input });
    });

    it(`correctly computes the result: ${result}`, () => {
      compareResults({ result1: equationX?.result, result2: result });
    });
  },
);
