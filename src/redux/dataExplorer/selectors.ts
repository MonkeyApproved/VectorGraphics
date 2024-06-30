import { RootState } from 'src/redux/store';
import { DataExplorer } from './explorer';
import { createSelector } from '@reduxjs/toolkit';

const getDatSetDict = (state: RootState) => state.dataExplorer.dataSets;

export const getDataExplorer = createSelector(
  [getDatSetDict, (state: RootState, managerId: string): string => managerId],
  (dataSetDict, managerId): DataExplorer => dataSetDict[managerId],
);
