export interface LookUp<T> {
  [key: string]: T;
}

export enum TokenType {
  Number = 'number',
  Array = 'array',
  Variable = 'variable',
  Cell = 'cell',
  CellRange = 'cellRange',
  Composition = 'composition',
  Function = 'function',
  Operator = 'operator',
  Unknown = 'unknown',
  Start = 'start',
  End = 'end',
}

export enum CompositionType {
  LeftParenthesis = '(',
  RightParenthesis = ')',
  ArrayStart = '[',
  ArrayEnd = ']',
  Comma = ',',
  Colon = ':',
}

export const CompositionString: LookUp<CompositionType> = {
  '(': CompositionType.LeftParenthesis,
  ')': CompositionType.RightParenthesis,
  '[': CompositionType.ArrayStart,
  ']': CompositionType.ArrayEnd,
  ',': CompositionType.Comma,
  ':': CompositionType.Colon,
};

export const operators: LookUp<string> = {
  '*': 'mul',
  '+': 'add',
  '-': 'sub',
  '/': 'div',
  _: 'part',
  '^': 'pow',
  '%': 'mod',
  negative: 'negative',
};

export const precedence: LookUp<number> = {
  mul: 3,
  add: 2,
  sub: 2,
  div: 3,
  part: 5,
  pow: 4,
  mod: 3,
  negative: 4,
};

export type asso = 'left' | 'right';

export const associativity: LookUp<asso> = {
  mul: 'left',
  add: 'left',
  sub: 'left',
  div: 'left',
  part: 'left',
  pow: 'right',
  mod: 'left',
  negative: 'left',
};

export enum TokenError {
  sequence = 'invalid sequence',
  openParenthesisMissing = 'no matching open parenthesis',
  closeParenthesisMissing = 'closing parenthesis missing',
  openArrayMissing = 'no matching open array',
  closeArrayMissing = 'array is not closed',
  misplacedColon = 'misplaced colon',
}

export enum TokenWarning {
  addMul = 'multiplication added',
}
