import { DataState } from '../dataSlice';
import { getNewEquation } from '../equations/equation';
import { MainContent, NewContentFunction, getContentId } from './mainContent';

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

export function addEquationToVariableTable({
  equationId,
  variableTableId,
  state,
}: {
  equationId: string;
  variableTableId: string;
  state: DataState;
}) {
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
