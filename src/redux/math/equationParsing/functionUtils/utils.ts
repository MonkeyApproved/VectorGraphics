import { oneArgFunctionDict, twoArgFunctionDict, nArgFunctionDict } from './defaultFunctions';
import { Arg, MathFunction } from './functionTypes';
import { MathState } from '../../slice';
import { internalNArgFunctionDict, internalOneArgFunctionDict, internalTwoArgFunctionDict } from './internalFunctions';

export function getFunction({ name, state }: { name: string; state: MathState }): MathFunction | undefined {
  return state.functions[name];
}

export function computeMathFunctionResult({ func, args }: { func: MathFunction; args: Arg[] }) {
  // check for correct number of arguments
  if (args.length < func.minArgs || args.length > func.maxArgs) {
    return `wrong number of arguments for function ${func.name}`;
  }

  // compute internal function results
  if (func.type === 'internal' && func.maxArgs === 1) {
    return internalOneArgFunctionDict[func.name]({ x: args[0] });
  } else if (func.type === 'internal' && func.maxArgs === 2) {
    return internalTwoArgFunctionDict[func.name]({ x: args[0], y: args[1] });
  } else if (func.type === 'internal') {
    return internalNArgFunctionDict[func.name]({ args });
  }

  // compute default function results
  if (func.type === 'default' && func.maxArgs === 1) {
    return oneArgFunctionDict[func.name]({ x: args[0] });
  } else if (func.type === 'default' && func.maxArgs === 2) {
    return twoArgFunctionDict[func.name]({ x: args[0], y: args[1] });
  } else if (func.type === 'default') {
    return nArgFunctionDict[func.name]({ args });
  }

  return 'custom functions not supported yet';
}
