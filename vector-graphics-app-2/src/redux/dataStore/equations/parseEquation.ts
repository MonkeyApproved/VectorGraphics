import { Equation } from './equation';
import {
  getNumberToken,
  getOperatorToken,
  getStringToken,
  getCompositionToken,
  getUnknownToken,
  getStartToken,
  getEndToken,
} from './tokenCreation';
import { Token, StartToken, EndToken } from './tokenTypes';

export default function getTokens({ equation }: { equation: Equation }): Equation {
  // split up the expression into it's basic elements (numbers, operators, variables, parenthesis)
  // all strings that are defined in mathFunctions() are treated as functions, all others are
  // treated as variable names.

  if (!equation.input) return equation;

  const startToken: StartToken = getStartToken();
  const endToken: EndToken = getEndToken(equation.input.length);
  const tokens: Token[] = [startToken, endToken];

  // look for variables and functions
  let leftOver = equation.input.replace(/[a-z]+[a-z0-9]*/gi, (match, offset) => {
    tokens.push(getStringToken(match, offset));
    return ' '.repeat(match.length);
  });

  // look for numbers
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
