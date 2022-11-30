import computeResult from './computeResult';
import getTokens from './parseEquation';
import getRPN from './reversePolishNotation';
import { RpnToken, Token } from './tokenTypes';

export interface Equation {
  input: string;
  tokens: Token[];
  error?: boolean;
  rpn?: RpnToken[];
  result?: number | number[] | undefined;
}

export interface EquationDict {
  [id: string]: Equation;
}

export default function getEquation(input: string): Equation {
  const tokens = getTokens({ equation: input });
  const error = hasError({ tokens });
  if (error) return { tokens, error, input, result: undefined, rpn: [] };
  const rpn = getRPN({ tokens });
  const result = computeResult({ rpn });
  return { tokens, error, input, result, rpn };
}

export function hasError({ tokens }: { tokens: Token[] }): boolean {
  tokens.forEach((token) => {
    if (token.error) return true;
  });
  return false;
}
