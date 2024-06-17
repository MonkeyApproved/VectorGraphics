import { setEquationError, tokenError } from './errors';
import { internalFunctions } from './functionUtils/internalFunctions';
import {
  getOperatorToken,
  getCompositionToken,
  CompositionType,
  TokenType,
  TokenWarning,
  Token,
  CompositionToken,
  ValueToken,
  FunctionToken,
  OperatorToken,
  isValue,
  valueNext,
  valuePrevious,
  getFunctionToken,
} from './tokenUtils';
import { Equation } from './types';

interface EquationStats {
  // track number of commas outside of functions or arrays
  groundLevelCommas: number;
  // track parenthesis nesting
  currentLevel: number; // number of currently open parenthesis
  hierarchy: Token[]; // for each level of parenthesis, store the relevant token
  // track progress of the loop
  index: number; // current index of token being checked (might jump during the loop)
  length: number; // length of the tokens array (might change during the loop)
}

/**
 * This function checks for different patterns in the parsed tokens and addresses the following issues:
 *  - Add missing multiplication: It is common practice to omit the multiplication operator, e.g. '2sin(A)' => '2*sin(A)'
 *  - Fix signs: '-' and '+' can be used as signs, not as operators, e.g. '-1+2' or '2+(-3+5)'. For this purpose, we have
 *    introduced a 'negative' operator, that is used to represent the negation of numbers: '-1+2' => 'negative 1 + 2'.
 *
 * @param {Object} params - Parameters
 * @param {Equation} params.equation - Equation with newly parsed tokens that need to be fixed
 * @returns {Equation} Equation with fixed tokens (in place)
 */
export default function fixTokens({ equation }: { equation: Equation }): Equation {
  if (!equation.tokens || equation.tokens.length === 0) return equation;

  const tracker: EquationStats = {
    groundLevelCommas: 0, // commas outside of any function or array: will be interpreted as an array
    currentLevel: -1, // current level of parenthesis nesting
    hierarchy: [],
    index: 0,
    length: equation.tokens.length,
  };

  // fix a range of custom syntax, all checks are performed on all tokens except the start/end tokens
  for (tracker.index = 1; tracker.index < tracker.length - 1; tracker.index++) {
    checkForMissingMul({ tokens: equation.tokens, tracker });
    checkForSign({ tokens: equation.tokens, tracker });
    handleComposition({ tokens: equation.tokens, tracker });
    handleComma({ tokens: equation.tokens, tracker });
  }

  // check the validity of the equation
  for (let index = 0; index < equation.tokens.length; index++) {
    checkValidity({ tokens: equation.tokens, index });
    const detectedError = equation.tokens[index].error;
    if (detectedError) {
      setEquationError({ equation, errorMessage: detectedError });
    }
  }
  checkParenthesis({ equation, tracker });
  return equation;
}

interface HelperFunctionProps {
  tokens: Token[];
  tracker: EquationStats;
}

function checkForMissingMul({ tokens, tracker }: HelperFunctionProps): void {
  const token = tokens[tracker.index];
  const next = tokens[tracker.index + 1];
  if (valuePrevious({ previous: token }) && valueNext({ next })) {
    // fix missing multiplication -> '2 sin(2)' or '2(1+1)' or '2 bob' or '2 A2'
    const offset = (token.position.offset + next.position.offset) / 2;
    const newToken = getOperatorToken('*', offset);
    newToken.warning = TokenWarning.addMul;
    tokens.splice(tracker.index + 1, 0, newToken);
    tracker.length += 1;
  }
}

function checkForSign({ tokens, tracker }: HelperFunctionProps): void {
  // check usage of '-' or '+' as sign:
  // -1+2 or 2+(-3+5) or array(+1,-2,3)
  const token = tokens[tracker.index];
  // check if current token is plus or minus operator
  if (token.type !== TokenType.Operator) return;
  if (['-', '+'].indexOf(token.symbol) === -1) return;

  // check that next token is some sort of value
  if (!valueNext({ next: tokens[tracker.index + 1] })) return;

  // check that previous token indicates that the operator should be a sign
  let isSign = false;
  const previous = tokens[tracker.index - 1];
  if (previous.type === TokenType.Operator && ['^', '*', '_', '/'].indexOf(previous.symbol) !== -1) {
    isSign = true;
  } else if (previous.type === TokenType.Composition) {
    if (['(', '[', ','].indexOf(previous.symbol) !== -1) {
      isSign = true;
    }
  } else if (previous.type === TokenType.Start) {
    isSign = true;
  }

  // if operator is a sign, remove plus signs and replace minus operator with "negative" operator
  if (isSign) {
    if (token.symbol === '+') {
      // remove plus sign (not needed)
      tokens.splice(tracker.index, 1);
      tracker.index;
      tracker.length -= 1;
    } else {
      const operatorToken = getOperatorToken('negative', token.position.offset);
      tokens.splice(tracker.index, 1, operatorToken);
    }
  }
}

function handleComposition({ tokens, tracker }: HelperFunctionProps): void {
  const token = tokens[tracker.index];
  if (token.type !== TokenType.Composition) return;

  if (token.name === CompositionType.LeftParenthesis) {
    const previous = tokens[tracker.index - 1];
    tracker.hierarchy.push(previous.type === TokenType.Function ? previous : token);
    tracker.currentLevel += 1;
    return;
  }

  if (token.name === CompositionType.ArrayStart) {
    const arrayFunction = getFunctionToken('array', token.position.offset, internalFunctions.array);
    const leftParenthesis = getCompositionToken('(', token.position.offset + 0.5);
    tokens.splice(tracker.index, 1, arrayFunction, leftParenthesis);
    tracker.length += 1;
    tracker.currentLevel += 1;
    tracker.index += 1;
    tracker.hierarchy.push(arrayFunction);
    return;
  }

  if (token.name === CompositionType.RightParenthesis) {
    if (tracker.currentLevel === -1) {
      token.error = tokenError.openParenthesisMissing;
      return;
    }

    tracker.currentLevel -= 1;
    const reference = tracker.hierarchy.pop(); // if the reference is a function, nArgs has reached it's final value
    if (reference?.type === TokenType.Function && reference.symbol === 'array') {
      // check that the corresponding token from hierarchy is not an array, but came from a left parenthesis
      token.error = tokenError.misplacedParenthesis;
      return;
    }
  }

  if (token.name === CompositionType.ArrayEnd) {
    if (tracker.currentLevel === -1) {
      token.error = tokenError.openArrayMissing;
      return;
    }

    tracker.currentLevel -= 1;
    const reference = tracker.hierarchy.pop();
    if (reference?.type === TokenType.Function && reference.definition.name === 'array') {
      // check if corresponding token was "open array": replace with parenthesis
      const rightParenthesis = getCompositionToken(')', token.position.offset);
      tokens.splice(tracker.index, 1, rightParenthesis);
    } else {
      token.error = tokenError.openArrayMissing;
    }
  }
}

function handleComma({ tokens, tracker }: HelperFunctionProps): void {
  const token = tokens[tracker.index];
  if (token.type !== TokenType.Composition || token.name !== CompositionType.Comma) return;

  if (tracker.currentLevel === -1) {
    // commas on ground level are interpreted as an array, 1,2,3 -> [1,2,3]
    tracker.groundLevelCommas += 1;
    return;
  }
  const reference = tracker.hierarchy[tracker.currentLevel];
  if (reference.type === TokenType.Function) {
    reference.nArgs += 1;
  }
}

function checkValidity({ tokens, index }: { tokens: Token[]; index: number }): void {
  // These are the possible token types:
  //   * Start / End -> ignore
  //   * Number / Variable / Cell / CellRange -> computes to number/array
  //   * Function -> uses the next nArg values as input and computes to number/array
  //   * Composition -> ) ( , : ] [
  //   * Operators -> + * ^ _ % / -
  if (!tokens) return;
  const token = tokens[index];
  if (token.type === TokenType.Start || token.type === TokenType.End) return;

  const previous = tokens[index - 1];
  const next = tokens[index + 1];
  if (isValue({ token })) {
    checkValueToken(token as ValueToken, previous, next);
    return;
  }
  if (token.type === TokenType.Function) {
    checkFunctionToken(token, previous, next);
    return;
  }
  if (token.type === TokenType.Composition) {
    checkCompositionToken(token, previous, next);
    return;
  }
  if (token.type === TokenType.Operator) {
    checkOperatorToken(token, previous, next);
    return;
  }
}

function checkValueToken(token: ValueToken, previous: Token, next: Token) {
  // valueTokens are Number, Cell, Variable, CellRange
  //   * invalid previous: valueToken, some Composition: ) ]
  //   * invalid next: Function, valueToken, some Composition: ( [
  if (isValue({ token: previous })) {
    token.error = tokenError.sequence;
    previous.error = tokenError.sequence;
    return;
  }
  if (previous.type === TokenType.Composition && [')', ']'].includes(previous.symbol)) {
    token.error = tokenError.sequence;
    previous.error = tokenError.sequence;
    return;
  }
  if (isValue({ token: next })) {
    token.error = tokenError.sequence;
    next.error = tokenError.sequence;
    return;
  }
  if (next.type === TokenType.Composition && ['[', '('].includes(next.symbol)) {
    token.error = tokenError.sequence;
    next.error = tokenError.sequence;
    return;
  }
  if (next.type === TokenType.Function) {
    token.error = tokenError.sequence;
    next.error = tokenError.sequence;
    return;
  }
}

function checkFunctionToken(token: FunctionToken, previous: Token, next: Token) {
  // Function Token, takes the next nArgs and returns a value
  //   * invalid previous: valueToken, some Composition: ) ] :
  //   * invalid next: End, Operator (except negative), some Composition: ) ] , :
  if (isValue({ token: previous })) {
    token.error = tokenError.sequence;
    previous.error = tokenError.sequence;
    return;
  }
  if (previous.type === TokenType.Composition && [')', ']', ':'].indexOf(previous.symbol) !== -1) {
    token.error = tokenError.sequence;
    previous.error = tokenError.sequence;
    return;
  }
  if (next.type === TokenType.End) {
    token.error = tokenError.sequence;
    return;
  }
  if (next.type === TokenType.Operator && next.symbol !== 'negative') {
    token.error = tokenError.sequence;
    next.error = tokenError.sequence;
    return;
  }
  if (next.type === TokenType.Composition && [')', ']', ':', ','].indexOf(next.symbol) !== -1) {
    token.error = tokenError.sequence;
    next.error = tokenError.sequence;
    return;
  }
}

function checkCompositionToken(token: CompositionToken, previous: Token, next: Token) {
  // composition tokens: ) ( , : ] [
  // most possible errors are handles by other checks. The remaining checks performed here are:
  //    * symbols ) ] , cannot have previous Start
  //    * symbols [ ( , cannot have next End
  //    * no two , can follow each other
  if (previous.type === TokenType.Start && [')', ']', ','].indexOf(token.symbol) !== -1) {
    token.error = tokenError.sequence;
    return;
  }
  if (next.type === TokenType.End && ['(', '[', ','].indexOf(token.symbol) !== -1) {
    token.error = tokenError.sequence;
    return;
  }
  if (token.symbol === ',' && previous.symbol === ',') {
    token.error = tokenError.sequence;
    previous.error = tokenError.sequence;
  }
}

function checkOperatorToken(token: OperatorToken, previous: Token, next: Token) {
  // operator tokens: + * ^ _ % / - negative
  //    * negative is ignored, as it's correct implementation is guaranteed by checkForSign()
  //    * invalid next: anything that does not compute to value
  //    * invalid previous: anything that is not a value
  if (token.symbol === 'negative') return;
  if (!valueNext({ next })) {
    token.error = tokenError.sequence;
    next.error = tokenError.sequence;
  }
  if (!valuePrevious({ previous })) {
    token.error = tokenError.sequence;
    previous.error = tokenError.sequence;
  }
}

function checkParenthesis({ equation, tracker }: { equation: Equation; tracker: EquationStats }): void {
  if (!equation.tokens) throw new Error(`Expected tokens.`);
  const tokens = equation.tokens;
  if (tracker.currentLevel < -1) {
    equation.errorMessage = tokenError.openParenthesisMissing;
    return;
  }

  if (tracker.currentLevel > -1) {
    const reference = tracker.hierarchy.pop();
    if (reference?.type === TokenType.Function && reference.symbol === 'array') {
      equation.errorMessage = tokenError.closeArrayMissing;
    } else {
      equation.errorMessage = tokenError.closeParenthesisMissing;
    }
    return;
  }

  if (tracker.groundLevelCommas === 0) return;

  const arrayFunction = getFunctionToken('array', 0.1, internalFunctions.array);
  arrayFunction.nArgs = tracker.groundLevelCommas + 1;
  const leftParenthesis = getCompositionToken('(', 0.2);
  const maxOffset = equation.tokens[tokens.length - 1].position.offset;
  const rightParenthesis = getCompositionToken(')', maxOffset + 1);
  tokens.splice(1, 0, arrayFunction, leftParenthesis);
  tokens.splice(tokens.length - 1, 0, rightParenthesis);
}
