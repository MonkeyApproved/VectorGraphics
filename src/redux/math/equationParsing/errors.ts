import { Equation } from '..';
import { FunctionToken, OperatorToken } from './tokenUtils';

/**
 * These errors can occur during the tokenization of an equation.
 * For details check 02_fixTokens.
 */
export const tokenError = {
  sequence: 'invalid sequence',
  openParenthesisMissing: 'no matching open parenthesis',
  closeParenthesisMissing: 'closing parenthesis missing',
  misplacedParenthesis: 'some parenthesis are misplaced',
  openArrayMissing: 'no matching open array',
  closeArrayMissing: 'array is not closed',
  misplacedColon: 'misplaced colon',
};

const unknownVariables = ({ unknownVariables }: { unknownVariables: string[] }): string => {
  unknownVariables.sort();
  return `Unknown variable(s): ${unknownVariables.join(', ')}`;
};

const undefinedVariables = ({ undefinedVariables }: { undefinedVariables: string[] }): string => {
  undefinedVariables.sort();
  return `Unknown variable(s): ${undefinedVariables.join(', ')}`;
};

const wrongNumberOfArgs = ({ token, nArgs }: { token: FunctionToken | OperatorToken; nArgs?: number }) => {
  const def = token.definition;
  nArgs = nArgs === undefined ? token.nArgs : nArgs; // need to check implicit undefined, as 0 is a valid value
  const got = `Got ${nArgs}`;
  const but = `but ${def.name}()`;
  const limit = def.minArgs > nArgs ? `requires ${def.minArgs}` : `only accepts ${def.maxArgs}`;
  return `${got}, ${but} ${limit} arguments.`;
};

export const equationError = {
  cyclicDependency: 'Cyclic dependency detected.',
  unknownVariables,
  undefinedVariables,
  divideByZero: 'Division by zero',
  tooManyArguments: 'Too many arguments',
  wrongNumberOfArgs,
};

export function setEquationError({ equation, errorMessage }: { equation: Equation; errorMessage: string }) {
  equation.errorMessage = errorMessage;
  equation.result = undefined;
  return equation;
}
