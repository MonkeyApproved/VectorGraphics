import { useSelector } from 'react-redux';
import { RootState } from './store';

// main store
export const useAppSelector = useSelector.withTypes<RootState>();

// math slice
export * from './math/selectors';

// canvas slice
export * from './canvas/selectors';
export * from './canvas/userActions/selectors';

// variableManager slice
export * from './variableManager/selectors';

// spreadsheet slice
export * from './spreadsheet/selectors';

// dataExplorer slice
export * from './dataExplorer/selectors';

// userInterface slice
export * from './userInterface/selectors';
