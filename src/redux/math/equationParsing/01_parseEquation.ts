import { MathState } from '../mathSlice';
import {
  getNumberToken,
  getOperatorToken,
  getStringToken,
  getCompositionToken,
  getUnknownToken,
  getStartToken,
  getEndToken,
} from './tokenUtils/tokenCreation';
import { Token, StartToken, EndToken } from './tokenUtils/tokenTypes';
import { Equation } from './types';

/**
 * This function is used to tokenize the input string of an equation.
 *
 * The input string is split up into tokens, which are subsequently reorganized into a
 * Reverse Polish Notation (RPN) representation of the equation and calculate it's result.
 *
 * Possible tokens are:
 *  - Variables: any word (letter followed by additional letters or numbers) that is not a function
 *  - Functions: any word that is listed in state.math.functions
 *  - Numbers: any part of the string that has the form DDD DDD.DDD (D = digit, delimiter always a dot)
 *  - Operators: +, -, *, /, ^, %, _
 *  - Composition: parenthesis ()[] and commas which are used to separate arguments in functions or arrays
 *
 * All substrings matching the above patterns are removed from the input string and at the end,
 * we check for any remaining characters that did not match any of the above patterns.
 *
 * @param {Object} params - Parameters
 * @param {Equation} params.equation - Equation containing input string to be tokenize
 * @param {MathState} params.state - Current state of the math slice
 * @returns {Equation} Equation with tokens added
 */
export default function getTokens({ equation, state }: { equation: Equation; state: MathState }): Equation {
  if (!equation.input) return equation;

  const startToken: StartToken = getStartToken();
  const endToken: EndToken = getEndToken(equation.input.length);
  const tokens: Token[] = [startToken, endToken];

  // look for variables and functions
  // based on the known functions in state, we decide if the string is a function or a variable
  let leftOver = equation.input.replace(/[a-z]+[a-z0-9]*/gi, (match, offset) => {
    tokens.push(getStringToken(match, offset, state));
    return ' '.repeat(match.length);
  });

  // look for numbers
  // so far the delimiter always needs to be a dot, commas are used for arrays
  leftOver = leftOver.replace(/[0-9]+[.]?[0-9]*/g, (match, offset) => {
    tokens.push(getNumberToken(match, offset));
    return ' '.repeat(match.length);
  });

  // look for operators
  leftOver = leftOver.replace(/[+*^_%/-]/g, (match, offset) => {
    tokens.push(getOperatorToken(match, offset));
    return ' ';
  });

  // look for composition, such as commas and parenthesis
  leftOver = leftOver.replace(/[)([,:\]]/g, (match, offset) => {
    tokens.push(getCompositionToken(match, offset));
    return ' ';
  });

  // look for unknown characters
  leftOver.replace(/[^\s]+/g, (match, offset) => {
    tokens.push(getUnknownToken(match, offset));
    return ' '.repeat(match.length);
  });

  tokens.sort((a, b) => a.position.offset - b.position.offset);

  equation.tokens = tokens;
  return equation;
}
