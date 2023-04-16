import { Equation } from './equation';
import { CompositionType, TokenType } from './tokenEnums';
import { CompositionToken, OperatorToken, RpnToken, SyntaxToken, Token } from './tokenTypes';
import { isValue } from './tokenUtils';

export default function getRPN({ equation }: { equation: Equation }): Equation {
  // calculate reverse polish notation based on Shunting-yard algorithm
  if (equation.errorMessage) return equation;
  if (!equation.tokens || equation.tokens.length == 0) return equation;

  const outputQueue: Token[] = [];
  const syntaxStack: SyntaxToken[] = [];

  equation.tokens.forEach((token) => {
    if (isValue({ token })) {
      outputQueue.push(token);
    } else if (token.type === TokenType.Function) {
      syntaxStack.push(token);
    } else if (token.type === TokenType.Operator) {
      queueOperator(token, syntaxStack, outputQueue);
    } else if (token.type === TokenType.Composition) {
      if (token.name === CompositionType.LeftParenthesis) {
        syntaxStack.push(token);
      } else if (token.name === CompositionType.RightParenthesis || token.name === CompositionType.Comma) {
        queueComposition(token, syntaxStack, outputQueue);
      }
    }
  });

  equation.rpn = filterTokens([...syntaxStack, ...outputQueue.reverse()]);
  return equation;
}

function queueOperator(token: OperatorToken, syntaxStack: SyntaxToken[], outputQueue: Token[]): void {
  // move tokens from syntaxStack -> outputQueue, as long as
  //        - top token is not a left parenthesis or comma
  //        - top token has greater precedence (or equal and token has left asso)
  while (syntaxStack.length > 0) {
    const topSyntax = syntaxStack[syntaxStack.length - 1];
    if (topSyntax.type === TokenType.Composition) {
      if (topSyntax.name === CompositionType.LeftParenthesis) break;
      if (topSyntax.name === CompositionType.Comma) break;
    } else if (topSyntax.type === TokenType.Operator) {
      if (topSyntax.precedence < token.precedence) break;
      if (topSyntax.precedence === token.precedence && token.associativity === 'right') break;
    }
    syntaxStack.pop();
    outputQueue.push(topSyntax);
  }
  // add token to operatorQueue
  syntaxStack.push(token);
}

function queueComposition(token: CompositionToken, syntaxStack: SyntaxToken[], outputQueue: Token[]): void {
  // Move tokens from syntaxStack -> outputQueue, until left parenthesis or comma appears.
  // The left parenthesis / comma is removed
  while (syntaxStack.length > 0) {
    const topSyntax = syntaxStack[syntaxStack.length - 1];
    syntaxStack.pop();
    if (topSyntax.type === TokenType.Composition) {
      // stop at the next comma or left parenthesis
      if (topSyntax.name === CompositionType.Comma) break;
      if (topSyntax.name === CompositionType.LeftParenthesis) break;
    }
    outputQueue.push(topSyntax);
  }

  // In case the queued token was a comma, we have to put it onto the stack,
  // as it now acts as the "new left parenthesis".
  if (token.name === CompositionType.Comma) {
    syntaxStack.push(token);
  }

  // In case of a left parenthesis, we have to check if the next token is a function.
  // If that is the case, we move it to the output as well.
  // The other case are parenthesis that are used for precedence, not to indicate start and end of function args.
  const topSyntax = syntaxStack[syntaxStack.length - 1];
  if (topSyntax?.type === TokenType.Function) {
    syntaxStack.pop();
    outputQueue.push(topSyntax);
  }
}

function filterTokens(tokens: Token[]): RpnToken[] {
  /*
    In order to compute the final result of the equation,
    we only require

  */
  const rpnTokens: RpnToken[] = [];
  tokens.forEach((token) => {
    if (
      token.type === TokenType.Operator ||
      token.type === TokenType.Function ||
      token.type === TokenType.Variable ||
      token.type === TokenType.Array ||
      token.type === TokenType.Number ||
      token.type === TokenType.CellRange ||
      token.type === TokenType.Cell
    ) {
      rpnTokens.push(token);
    }
  });
  return rpnTokens;
}
