import { DataSliceReducer, DataState } from '../dataSlice';
import { RenameIdProps, getNewEquation, renameEquation } from '../equations/equation';
import { MainContent, NewContentFunction, getContentId } from './content';

export interface VariableTable extends MainContent {
  type: 'variables';
  variableIds: string[];
}

export function getNewVariableTable({ label, containerId }: NewContentFunction): VariableTable {
  return {
    id: getContentId({ type: 'variables' }),
    containerId: containerId,
    type: 'variables',
    label: label,
    variableIds: [],
  };
}

interface SingleVariableFuncProps {
  equationId: string;
  variableTableId: string;
  state: DataState;
}

export function addEquationToVariableTable({ equationId, variableTableId, state }: SingleVariableFuncProps) {
  // first we will try to add the equation to the variable table
  const variableTable = state.userInterface.allContent[variableTableId];
  if (!variableTable) throw new Error(`Unknown content id "${variableTableId}"`);
  const contentType = variableTable.type;
  if (contentType !== 'variables') throw new Error(`Invalid content type, expected variables, got ${contentType}`);
  variableTable.variableIds.push(equationId);

  // now we make sure that the equation either already exists or we add it
  if (!state.equations[equationId]) {
    state.equations[equationId] = getNewEquation({ id: equationId, input: '' });
  }
}

export function renameEquationInAllVariableTables({ oldId, newId, state }: RenameIdProps) {
  Object.values(state.userInterface.allContent).forEach((content) => {
    if (content.type === 'variables' && content.variableIds.includes(oldId)) {
      content.variableIds[content.variableIds.indexOf(oldId)] = newId;
    }
  });
}

export function removeIdFromVariableIds({ equationId, variableTableId, state }: SingleVariableFuncProps) {
  const content = state.userInterface.allContent[variableTableId];
  if (content.type !== 'variables') throw new Error(`Invalid content type, expected variables, got ${content.type}`);

  const index = content.variableIds.indexOf(equationId);
  if (index === -1) throw new Error(`Cannot remove variable "${equationId}" from "${content.id}": not found.`);

  content.variableIds.splice(index, 1);
}

const addVariable: DataSliceReducer<Omit<SingleVariableFuncProps, 'state'>> = (state, { payload }) => {
  addEquationToVariableTable({ ...payload, state });
};

const renameVariable: DataSliceReducer<Omit<RenameIdProps, 'state'>> = (state, { payload }) => {
  renameEquationInAllVariableTables({ ...payload, state });
  renameEquation({ ...payload, state });
};

const removeVariableFromTable: DataSliceReducer<Omit<SingleVariableFuncProps, 'state'>> = (state, { payload }) => {
  removeIdFromVariableIds({ ...payload, state });
};

export const variableTableReducers = {
  addVariable,
  renameVariable,
  removeVariableFromTable,
};
