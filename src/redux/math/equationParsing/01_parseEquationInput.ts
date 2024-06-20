import { Equation } from './types';
import getTokens from './02_getTokens';
import fixTokens from './03_fixTokens';
import getRPN from './04_reversePolishNotation';
import updateDependencies from './05_updateDependencies';
import { directlyParseResultFromInput, setEquationResult } from './result';
import { MathState } from '../mathSlice';
import { getEndToken, getNumberToken, getStartToken } from './tokenUtils';

function formatInputAsString(input: string | number): string {
  return typeof input === 'number' ? input.toString() : input;
}

export default function parseEquationInput({
  equation,
  value,
  state,
}: {
  equation: Equation;
  value: string | number;
  state: MathState;
}): void {
  const input = formatInputAsString(value);
  equation.input = input;

  // check if input is already a number (e.g. "1.234")
  const inputAsNumber = directlyParseResultFromInput({ input: value });

  if (inputAsNumber !== undefined) {
    // a number, not an equation (string) was passed -> we can keep it short...
    // tokens and rpn is just added to keep the equation object consistent
    setEquationResult({ equation, result: inputAsNumber });
    equation.tokens = [getStartToken(), getNumberToken(inputAsNumber, 0), getEndToken(input.length)];
    equation.rpn = [getNumberToken(inputAsNumber, 0)];
  } else {
    // if a real equation is passed, we evaluate it
    getTokens({ equation, state });
    fixTokens({ equation });
    getRPN({ equation });
  }

  // check for new or deprecated parents
  updateDependencies({ equation, state });
}
