export type Arg = number | number[];

function oneArgFunctionFactory(x: Arg, func: (x: number) => number): Arg | string {
  if (typeof x === 'number') {
    if (isNaN(x)) {
      return NaN;
    }
    return func(x);
  } else if (typeof x === 'object') {
    return x.map((xi: number) => func(xi));
  } else {
    return 'unknown data type in evaluation function';
  }
}

function twoArgFunctionFactory(x: Arg, y: Arg, func: (x: number, y: number) => number): Arg | string {
  if (typeof x === 'number' && typeof y === 'number') {
    if (isNaN(x) || isNaN(y)) {
      return NaN;
    } else {
      return func(x, y);
    }
  } else if (typeof x === 'object' && typeof y === 'number') {
    return x.map((xi: number) => func(xi, y));
  } else if (typeof x === 'number' && typeof y === 'object') {
    return y.map((yi: number) => func(x, yi));
  } else if (typeof x === 'object' && typeof y === 'object') {
    if (x.length !== y.length) {
      return `dimensions do not match`;
    } else {
      return x.map((xi: number, i: number) => func(xi, y[i]));
    }
  } else {
    return 'function called with non-numeric value';
  }
}

export type oneArgFunction = ({ x }: { x: Arg }) => Arg | string;
export type twoArgFunction = ({ x, y }: { x: Arg; y: Arg }) => Arg | string;
export type nArgFunction = ({ args }: { args: Arg[] }) => Arg | string;

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

export const oneArgFunctionDict: { [key: string]: oneArgFunction } = {
  negative: ({ x }) => oneArgFunctionFactory(x, (x) => -x),
  acos: ({ x }) => oneArgFunctionFactory(x, (x) => Math.acos(x)),
  acosh: ({ x }) => oneArgFunctionFactory(x, (x) => Math.acosh(x)),
  asin: ({ x }) => oneArgFunctionFactory(x, (x) => Math.asin(x)),
  asinh: ({ x }) => oneArgFunctionFactory(x, (x) => Math.asinh(x)),
  atan: ({ x }) => oneArgFunctionFactory(x, (x) => Math.atan(x)),
  atanh: ({ x }) => oneArgFunctionFactory(x, (x) => Math.atanh(x)),
  cbrt: ({ x }) => oneArgFunctionFactory(x, (x) => Math.cbrt(x)),
  ceil: ({ x }) => oneArgFunctionFactory(x, (x) => Math.ceil(x)),
  clz32: ({ x }) => oneArgFunctionFactory(x, (x) => Math.clz32(x)),
  cos: ({ x }) => oneArgFunctionFactory(x, (x) => Math.cos(x)),
  cosh: ({ x }) => oneArgFunctionFactory(x, (x) => Math.cosh(x)),
  exp: ({ x }) => oneArgFunctionFactory(x, (x) => Math.exp(x)),
  expm1: ({ x }) => oneArgFunctionFactory(x, (x) => Math.expm1(x)),
  floor: ({ x }) => oneArgFunctionFactory(x, (x) => Math.floor(x)),
  fround: ({ x }) => oneArgFunctionFactory(x, (x) => Math.fround(x)),
  hypot: ({ x }) => oneArgFunctionFactory(x, (x) => Math.hypot(x)),
  log: ({ x }) => oneArgFunctionFactory(x, (x) => Math.log(x)),
  log10: ({ x }) => oneArgFunctionFactory(x, (x) => Math.log10(x)),
  log1p: ({ x }) => oneArgFunctionFactory(x, (x) => Math.log1p(x)),
  log2: ({ x }) => oneArgFunctionFactory(x, (x) => Math.log2(x)),
  max: ({ x }) => oneArgFunctionFactory(x, (x) => Math.max(x)),
  min: ({ x }) => oneArgFunctionFactory(x, (x) => Math.min(x)),
  random: ({ x }) => oneArgFunctionFactory(x, (x) => x * Math.random()),
  round: ({ x }) => oneArgFunctionFactory(x, (x) => Math.round(x)),
  sign: ({ x }) => oneArgFunctionFactory(x, (x) => Math.sign(x)),
  sin: ({ x }) => oneArgFunctionFactory(x, (x) => Math.sin(x)),
  sinh: ({ x }) => oneArgFunctionFactory(x, (x) => Math.sinh(x)),
  sqrt: ({ x }) => oneArgFunctionFactory(x, (x) => Math.sqrt(x)),
  tan: ({ x }) => oneArgFunctionFactory(x, (x) => Math.tan(x)),
  tanh: ({ x }) => oneArgFunctionFactory(x, (x) => Math.tanh(x)),
  trunc: ({ x }) => oneArgFunctionFactory(x, (x) => Math.trunc(x)),
};

export const twoArgFunctionDict: { [key: string]: twoArgFunction } = {
  part,
  add: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x + y),
  sub: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x - y),
  mul: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x * y),
  div: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => x / y),
  atan2: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => Math.atan2(x, y)),
  imul: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => Math.imul(x, y)),
  pow: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => Math.pow(x, y)),
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

export const nArgFunctionDict: { [key: string]: nArgFunction } = {
  array,
};

export const allFunctionDict: { [key: string]: oneArgFunction | twoArgFunction | nArgFunction } = {
  ...oneArgFunctionDict,
  ...twoArgFunctionDict,
  ...nArgFunctionDict,
};

export interface MathFunction {
  name: string;
  minArgs: number;
  maxArgs: number;
}

export function getMathFunctionDetails({ name }: { name: string }): MathFunction {
  // any function requires at least one argument
  let minArgs = 1;
  let maxArgs = Infinity;
  if (oneArgFunctionDict[name]) {
    maxArgs = 1;
  } else if (twoArgFunctionDict[name]) {
    minArgs = 2;
    maxArgs = 2;
  }

  return { name, minArgs, maxArgs };
}

export function isValidFunctionName({ name }: { name: string }): boolean {
  if (allFunctionDict[name]) {
    return true;
  }
  return false;
}

export function computeMathFunctionResult({ funcName, args }: { funcName: string; args: Arg[] }) {
  if (oneArgFunctionDict[funcName]) {
    if (args.length !== 1) {
      // invalid argument count, this function requires exactly one argument
      return null;
    }
    return oneArgFunctionDict[funcName]({ x: args[0] });
  } else if (twoArgFunctionDict[funcName]) {
    if (args.length !== 2) {
      // invalid argument count, this function requires exactly two arguments
      return null;
    }
    return twoArgFunctionDict[funcName]({ x: args[0], y: args[1] });
  } else if (nArgFunctionDict[funcName]) {
    return nArgFunctionDict[funcName]({ args });
  }
}

export const functionNames: string[] = Object.keys(allFunctionDict);
