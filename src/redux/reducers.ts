import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';

// main store
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// math slice
export * from './math/slice';

// canvas slice
export * from './canvas/slice';

// variableManager slice
export * from './variableManager/slice';

// spreadsheet slice
export * from './spreadsheet/slice';

// dataExplorer slice
export * from './dataExplorer/slice';

// userInterface slice
export * from './userInterface/slice';
