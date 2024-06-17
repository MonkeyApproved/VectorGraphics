import { Equation } from '../types';

export type Arg = number | number[];

export function oneArgFunctionFactory(x: Arg, func: (x: number) => number): Arg | string {
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

export function twoArgFunctionFactory(x: Arg, y: Arg, func: (x: number, y: number) => number): Arg | string {
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

export interface BaseFunction {
  type: string;
  name: string;
  minArgs: number;
  maxArgs: number;
}

export interface DefaultFunction extends BaseFunction {
  type: 'default';
}

export interface InternalFunction extends BaseFunction {
  type: 'internal';
}

export interface CustomFunction extends BaseFunction {
  type: 'custom';
  definition: Equation;
}

export type MathFunction = DefaultFunction | InternalFunction | CustomFunction;
