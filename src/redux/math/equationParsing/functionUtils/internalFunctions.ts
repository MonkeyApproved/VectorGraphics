import {
  oneArgFunctionFactory,
  twoArgFunction,
  twoArgFunctionFactory,
  nArgFunction,
  InternalFunction,
  oneArgFunction,
} from './functionTypes';

const part: twoArgFunction = ({ x, y }): number | string => {
  if (typeof y !== 'number') {
    return 'index needs to be a number';
  } else if (typeof x !== 'object') {
    return 'array expected';
  } else if (Math.abs(y) > x.length) {
    return `index out of range (index: ${y}, array: ${x.length})`;
  } else if (y === 0) {
    return 'index 0 is invalid (start at 1)';
  } else if (y < 0) {
    return x[x.length + y];
  } else {
    return x[y - 1];
  }
};

const array: nArgFunction = ({ args }): number[] | string => {
  const result: number[] = [];
  args.forEach((arg) => {
    if (typeof arg !== 'number') {
      return 'nested arrays are not supported';
    }
    result.push(arg);
  });
  return result;
};

const div: twoArgFunction = ({ x, y }) => {
  if (y == 0) {
    return 'division by zero';
  }
  return twoArgFunctionFactory(x, y, (x, y) => x / y);
};

export const internalOneArgFunctionDict: { [key: string]: oneArgFunction } = {
  negative: ({ x }) => oneArgFunctionFactory(x, (x) => -x),
};

export const internalTwoArgFunctionDict: { [key: string]: twoArgFunction } = {
  part,
  add: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x + y),
  sub: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x - y),
  mul: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x * y),
  div,
  pow: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => Math.pow(x, y)),
};

export const internalNArgFunctionDict: { [key: string]: nArgFunction } = {
  array,
};

export const internalFunctions: { [key: string]: InternalFunction } = {
  // single argument functions
  negative: { type: 'internal', name: 'negative', minArgs: 1, maxArgs: 1 },
  // two argument functions
  part: { type: 'internal', name: 'part', minArgs: 2, maxArgs: 2 },
  add: { type: 'internal', name: 'add', minArgs: 2, maxArgs: 2 },
  sub: { type: 'internal', name: 'sub', minArgs: 2, maxArgs: 2 },
  mul: { type: 'internal', name: 'mul', minArgs: 2, maxArgs: 2 },
  div: { type: 'internal', name: 'div', minArgs: 2, maxArgs: 2 },
  pow: { type: 'internal', name: 'pow', minArgs: 2, maxArgs: 2 },
  // n argument functions
  array: { type: 'internal', name: 'array', minArgs: 1, maxArgs: Infinity },
};
