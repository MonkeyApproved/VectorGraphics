/* eslint-disable no-console */
import { TokenType } from './tokenEnums';
import { Token } from './tokenTypes';

const pos2String = (token: Token): string => {
  return `(${token.position.offset}, ${token.position.length})`;
};

function logToken(token: Token): void {
  switch (token.type) {
    case TokenType.Number:
      console.log(`${pos2String(token)} number: ${token.value}`);
      break;
    case TokenType.Variable:
      console.log(`${pos2String(token)} variable: ${token.name}`);
      break;
    case TokenType.Composition:
      console.log(`${pos2String(token)} composition: ${token.name}`);
      break;
    case TokenType.Cell:
      console.log(`${pos2String(token)} cell: ${token.name}`);
      break;
    case TokenType.CellRange:
      console.log(`${pos2String(token)} cell range: ${token.from.name} - ${token.to.name}`);
      break;
    case TokenType.Function:
      console.log(`${pos2String(token)} function: ${token.name}, nArgs: ${token.nArgs}`);
      break;
    case TokenType.Operator:
      console.log(`${pos2String(token)} operator: ${token.name}`);
      break;
    case TokenType.Unknown:
      console.log(`${pos2String(token)} unknown: ${token.name}`);
      break;
    case TokenType.Start:
      console.log(`### Token List: `);
      break;
    case TokenType.End:
      console.log(`################`);
      break;
    default:
      console.log('unknown token');
  }
  if (token.error) {
    console.warn(`parsing failed: ${token.error}`);
  }
}

export const logTokenList = (tokenList: Token[]): void => {
  for (const token of tokenList) {
    logToken(token);
  }
};

export const printEquation = (tokenList: Token[]): void => {
  let equation = '';
  tokenList.forEach((token) => (equation += ` ${token.symbol}`));
  console.log(equation);
};
