import {
  oneArgFunction,
  oneArgFunctionFactory,
  twoArgFunction,
  twoArgFunctionFactory,
  nArgFunction,
  DefaultFunction,
} from './functionTypes';

const sum: nArgFunction = ({ args }): number | string => {
  let result = 0;
  args.forEach((arg) => {
    if (typeof arg === 'number') {
      result += arg;
    } else if (typeof arg === 'object') {
      const arraySum = sum({ args: arg });
      if (typeof arraySum === 'number') {
        result += arraySum;
      }
      return 'only numbers are supported';
    } else {
      return 'only numbers are supported';
    }
  });
  return result;
};

export const oneArgFunctionDict: { [key: string]: oneArgFunction } = {
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
  atan2: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => Math.atan2(x, y)),
  imul: ({ x, y }) => twoArgFunctionFactory(x, y, (x, y) => Math.imul(x, y)),
};

export const nArgFunctionDict: { [key: string]: nArgFunction } = {
  sum,
  max: ({ args }) => Math.max(...args.flat()),
  min: ({ args }) => Math.min(...args.flat()),
};

export function getFunctionDict(): { [functionName: string]: DefaultFunction } {
  const defaultFunctionDict: { [functionName: string]: DefaultFunction } = {};
  Object.keys(oneArgFunctionDict).forEach((functionName) => {
    defaultFunctionDict[functionName] = {
      type: 'default',
      minArgs: 1,
      maxArgs: 1,
      name: functionName,
    };
  });
  Object.keys(twoArgFunctionDict).forEach((functionName) => {
    defaultFunctionDict[functionName] = {
      type: 'default',
      minArgs: 2,
      maxArgs: 2,
      name: functionName,
    };
  });
  Object.keys(nArgFunctionDict).forEach((functionName) => {
    defaultFunctionDict[functionName] = {
      type: 'default',
      minArgs: 1,
      maxArgs: Infinity,
      name: functionName,
    };
  });
  return defaultFunctionDict;
}
