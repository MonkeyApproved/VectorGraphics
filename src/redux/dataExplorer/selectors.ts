import { RootState } from 'src/redux/store';
import { DataExplorer } from './explorer';

export const getDataExplorer =
  ({ managerId }: { managerId: string }) =>
  (state: RootState): DataExplorer =>
    state.dataExplorer.dataSets[managerId];
