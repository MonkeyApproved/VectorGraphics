import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { submitEquation } from 'redux/dataStore/dataSlice';
import { getSpreadsheetColumnLabel, getSpreadsheetRowLabel } from 'generalHelpers/stringHelper';
import { getEquationById } from 'redux/dataStore/equations/selectors';
import styles from './styles.module.css';

export interface CellInputProps {
  spreadsheetId: string;
  rowIndex: number;
  columnIndex: number;
}

export default function CellInput({ spreadsheetId, rowIndex, columnIndex }: CellInputProps) {
  const rowId = getSpreadsheetRowLabel({ index: rowIndex });
  const columnId = getSpreadsheetColumnLabel({ index: columnIndex });
  const cellId = `${columnId}${rowId}`;
  const equation = useAppSelector(getEquationById(cellId));

  const dispatch = useAppDispatch();

  const onValueChange = (newValue: string) => {
    dispatch(submitEquation({ id: cellId, input: newValue }));
  };

  const getDisplayValue = () => {
    if (!equation) return '';
    if (!equation?.input) return '';
    if (equation.errorMessage) return equation.input;
    if (equation.result) return equation.result;
    return equation.lastValidNumber;
  };

  return (
    <div
      key={`${spreadsheetId}-${cellId}`}
      className={styles.inputWrapper}
      style={{ gridColumn: columnIndex + 2, gridRow: rowIndex + 2 }}
    >
      <div className={styles.result}>{getDisplayValue()}</div>
      <input className={styles.input} value={equation?.input} onChange={(e) => onValueChange(e.target.value)}></input>
    </div>
  );
}
