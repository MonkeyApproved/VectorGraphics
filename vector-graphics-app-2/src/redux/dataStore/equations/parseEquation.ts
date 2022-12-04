import { Equation } from './equation';
import {
  getNumberToken,
  getOperatorToken,
  getStringToken,
  getCompositionToken,
  getUnknownToken,
  getStartToken,
  getEndToken,
  getCellRangeToken,
  getFunctionToken,
} from './tokenCreation';
import { CompositionType, TokenError, TokenType, TokenWarning } from './tokenEnums';
import { Token, StartToken, EndToken, CompositionToken, ValueToken, FunctionToken, OperatorToken } from './tokenTypes';
import { computesToValue, isValue, valueNext } from './tokenUtils';

export default function getTokens({ equation }: { equation: Equation }): Equation {
  parseEquation(equation);
  return fixTokens({ equation });
}

function parseEquation(equation: Equation): Equation {
  // split up the expression into it's basic elements (numbers, operators, variables, parenthesis)
  // all strings that are defined in mathFunctions() are treated as functions, all others are
  // treated as variable names.

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

  // look for brackets
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

interface EquationStats {
  groundLevelCommas: number;
  currentLevel: number;
  hierarchy: Token[];
  index: number;
  length: number;
}

function fixTokens({ equation }: { equation: Equation }): Equation {
  if (!equation.tokens) return equation;

  const tracker: EquationStats = {
    groundLevelCommas: 0,
    currentLevel: -1,
    hierarchy: [],
    index: 1,
    length: equation.tokens.length,
  };

  // fix a range of custom syntax
  for (tracker.index = 1; tracker.index < tracker.length - 1; tracker.index++) {
    checkForMissingMul(equation.tokens, tracker);
    checkForSign(equation.tokens, tracker);
    handleCellRange(equation.tokens, tracker);
    handleArrays(equation.tokens, tracker);
    handleParenthesis(equation.tokens, tracker);
    handleComma(equation.tokens, tracker);
  }

  // check the validity of the equation
  for (let index = 0; index < equation.tokens.length; index++) {
    checkValidity(equation.tokens, index);
  }
  checkParenthesis(equation.tokens, tracker);

  return equation;
}

function checkForMissingMul(tokens: Token[], tracker: EquationStats): void {
  const token = tokens[tracker.index];
  const next = tokens[tracker.index + 1];
  if (isValue(token) && valueNext(next)) {
    // fix missing multiplication -> '2 sin(2)' or '2(1+1)' or '2 bob' or '2 A2'
    const offset = (token.position.offset + next.position.offset) / 2;
    const newToken = getOperatorToken('*', offset);
    newToken.warning = TokenWarning.addMul;
    tokens.splice(tracker.index + 1, 0, newToken);
    tracker.length += 1;
  }
}

function checkForSign(tokens: Token[], tracker: EquationStats): void {
  // check usage of '-' or '+' as sign:
  // -1+2 or 2+(-3+5) or array(+1,-2,3)

  const token = tokens[tracker.index];
  // check if current token is plus or minus operator
  if (token.type !== TokenType.Operator) return;
  if (['-', '+'].indexOf(token.symbol) === -1) return;

  // check that next token is some sort of value
  if (!computesToValue(tokens[tracker.index + 1])) return;

  // check that previous token indicates that the operator should be a sign
  let isSign = false;
  const previous = tokens[tracker.index - 1];
  if (previous.type === TokenType.Operator) {
    if (['^', '*', '_', '/'].indexOf(previous.symbol) !== -1) {
      isSign = true;
    }
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
      tokens.splice(tracker.index, 1, getOperatorToken('negative', token.position.offset));
    }
  }
}

function handleCellRange(tokens: Token[], tracker: EquationStats): void {
  const token = tokens[tracker.index];
  // check if token is a colon (used to indicate cell ranges, e.g. A1:E4)
  if (token.type !== TokenType.Composition) return;
  if (token.name !== CompositionType.Colon) return;

  // before and after colon there must be cell tokens
  const previous = tokens[tracker.index - 1];
  const next = tokens[tracker.index + 1];
  if (previous.type === TokenType.Cell && next.type === TokenType.Cell) {
    const cellRange = getCellRangeToken(previous, next);
    tokens.splice(tracker.index - 1, 3, cellRange);
    tracker.index -= 1;
    tracker.length -= 2;
  } else {
    // invalid use of colon
    token.error = TokenError.misplacedColon;
  }
}

function handleArrays(tokens: Token[], tracker: EquationStats): void {
  const token = tokens[tracker.index];
  if (token.type !== TokenType.Composition) return;

  if (token.name === CompositionType.ArrayStart) {
    const arrayFunction = getFunctionToken('array', token.position.offset);
    const leftParenthesis = getCompositionToken('(', token.position.offset + 0.5);
    tokens.splice(tracker.index, 1, arrayFunction, leftParenthesis);
    tracker.length += 1;
    tracker.index += 1;
    tracker.currentLevel += 1;
    tracker.hierarchy.push(token);
    return;
  }

  if (token.name === CompositionType.ArrayEnd) {
    if (tracker.currentLevel === -1) {
      token.error = TokenError.openArrayMissing;
      return;
    }

    const reference = tracker.hierarchy.pop();
    tracker.currentLevel -= 1;
    // check if corresponding token was "open array"
    if (reference?.type !== TokenType.Function || reference.name !== 'array') {
      token.error = TokenError.openArrayMissing;
      return;
    }

    // replace with parenthesis
    const rightParenthesis = getCompositionToken(')', token.position.offset);
    tokens.splice(tracker.index, 1, rightParenthesis);
  }
}

function handleParenthesis(tokens: Token[], tracker: EquationStats): void {
  const token = tokens[tracker.index];
  if (token.type !== TokenType.Composition) return;

  if (token.name === CompositionType.LeftParenthesis) {
    const previous = tokens[tracker.index - 1];
    tracker.hierarchy.push(previous.type === TokenType.Function ? previous : token);
    tracker.currentLevel += 1;
    return;
  }

  if (token.name === CompositionType.RightParenthesis) {
    if (tracker.currentLevel === -1) {
      token.error = TokenError.closeParenthesisMissing;
      return;
    }

    tracker.currentLevel -= 1;
    tracker.hierarchy.pop();
  }
}

function handleComma(tokens: Token[], tracker: EquationStats): void {
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

function checkValidity(tokens: Token[], index: number): void {
  // These are the possible token types:
  //   * Start / End -> ignore
  //   * Number / Variable / Cell / CellRange -> computes to number/array
  //   * Function -> uses the next nArg values as input and computes to number/array
  //   * Composition -> ) ( , : ] [
  //   * Operators -> + * ^ _ % / -

  if (index === 0 || index === tokens.length - 1) return;

  const token = tokens[index];
  const previous = tokens[index - 1];
  const next = tokens[index + 1];
  if (isValue(token)) {
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
  if (isValue(previous)) {
    token.error = TokenError.sequence;
    previous.error = TokenError.sequence;
    return;
  }
  if (previous.type === TokenType.Composition && [')', ']'].indexOf(previous.symbol) !== -1) {
    token.error = TokenError.sequence;
    previous.error = TokenError.sequence;
    return;
  }
  if (isValue(next)) {
    token.error = TokenError.sequence;
    next.error = TokenError.sequence;
    return;
  }
  if (next.type === TokenType.Composition && ['[', '('].indexOf(next.symbol) !== -1) {
    token.error = TokenError.sequence;
    next.error = TokenError.sequence;
    return;
  }
  if (next.type === TokenType.Function) {
    token.error = TokenError.sequence;
    next.error = TokenError.sequence;
    return;
  }
}

function checkFunctionToken(token: FunctionToken, previous: Token, next: Token) {
  // Function Token, takes the next nArgs and returns a value
  //   * invalid previous: valueToken, some Composition: ) ] :
  //   * invalid next: End, Operator (except negative), some Composition: ) ] , :
  if (isValue(previous)) {
    token.error = TokenError.sequence;
    previous.error = TokenError.sequence;
    return;
  }
  if (previous.type === TokenType.Composition && [')', ']', ':'].indexOf(previous.symbol) !== -1) {
    token.error = TokenError.sequence;
    previous.error = TokenError.sequence;
    return;
  }
  if (next.type === TokenType.End) {
    token.error = TokenError.sequence;
    return;
  }
  if (next.type === TokenType.Operator && next.symbol !== 'negative') {
    token.error = TokenError.sequence;
    next.error = TokenError.sequence;
    return;
  }
  if (next.type === TokenType.Composition && [')', ']', ':', ','].indexOf(next.symbol) !== -1) {
    token.error = TokenError.sequence;
    next.error = TokenError.sequence;
    return;
  }
}

function checkCompositionToken(token: CompositionToken, previous: Token, next: Token) {
  // composition tokens: ) ( , : ] [
  // most possible errors are handles by other checks. The remaining checks performed here are:
  //    * symbols ) ] , cannot have previous Start
  //    * sympols [ ( , cannot have next End
  if (previous.type === TokenType.Start && [')', ']', ','].indexOf(token.symbol) !== -1) {
    token.error = TokenError.sequence;
    return;
  }
  if (next.type === TokenType.End && ['(', '[', ','].indexOf(token.symbol) !== -1) {
    token.error = TokenError.sequence;
    return;
  }
}

function checkOperatorToken(token: OperatorToken, previous: Token, next: Token) {
  // operator tokens: + * ^ _ % / - negative
  //    * negative is ignored, as it's correct implementation is guaranteed by checkForSign()
  //    * invalid next: anything that does not compute to value
  //    * invalid previous: anything that is not a value
  if (token.symbol === 'negative') return;
  if (!valueNext(next)) {
    token.error = TokenError.sequence;
    next.error = TokenError.sequence;
  }
  if (!isValue(previous)) {
    token.error = TokenError.sequence;
    previous.error = TokenError.sequence;
  }
}

function checkParenthesis(tokens: Token[], tracker: EquationStats): void {
  if (tracker.currentLevel < -1) {
    tokens[0].error = TokenError.openParenthesisMissing;
    return;
  }

  if (tracker.currentLevel > -1) {
    tokens[0].error = TokenError.closeParenthesisMissing;
    return;
  }

  if (tracker.groundLevelCommas === 0) return;

  const arrayFunction = getFunctionToken('array', 0.1);
  arrayFunction.nArgs = tracker.groundLevelCommas + 1;
  const leftParenthesis = getCompositionToken('(', 0.2);
  const maxOffset = tokens[tokens.length - 1].position.offset;
  const rightParenthesis = getCompositionToken(')', maxOffset + 1);
  tokens.splice(1, 0, arrayFunction, leftParenthesis);
  tokens.splice(tokens.length - 1, 0, rightParenthesis);
}
