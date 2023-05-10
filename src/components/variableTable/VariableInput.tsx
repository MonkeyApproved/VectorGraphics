import styles from './styles.module.css';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { addVariable, renameVariable } from 'redux/dataStore/dataSlice';
import { submitEquation } from 'redux/dataStore/dataSlice';
import { useState } from 'react';
import { getVariableTableEquation } from 'redux/dataStore/userInterface/selectors';

export interface VariableInputProps {
  variableTableId: string;
  index: number;
}

export default function VariableInput({ variableTableId, index }: VariableInputProps) {
  const equation = useAppSelector(getVariableTableEquation(index, variableTableId));
  const [currentName, setCurrentName] = useState(equation?.id || '');
  const dispatch = useAppDispatch();

  const onNameChange = (newName: string) => {
    setCurrentName(newName);
    if (equation) {
      dispatch(renameVariable({ oldId: equation.id, newId: newName }));
    } else if (newName) {
      dispatch(addVariable({ equationId: currentName, variableTableId }));
    }
  };

  const onValueChange = (newValue: string) => {
    if (!equation) return;
    dispatch(submitEquation({ id: equation.id, input: newValue }));
  };

  const getDisplayValue = () => {
    if (!equation) return '';
    if (!equation?.input) return '';
    if (equation.errorMessage) return equation.input;
    if (equation.result) return equation.result;
    return equation.lastValidNumber;
  };

  return (
    <>
      <div
        key={`variable-name-${index}}`}
        className={styles.inputWrapper}
        style={{ gridColumn: 1, gridRow: index + 2 }}
      >
        <div className={styles.result}>{equation?.id}</div>
        <input className={styles.input} value={currentName} onChange={(e) => onNameChange(e.target.value)}></input>
      </div>
      <div
        key={`variable-value-${index}`}
        className={styles.inputWrapper}
        style={{ gridColumn: 2, gridRow: index + 2 }}
      >
        <div className={styles.result}>{getDisplayValue()}</div>
        <input className={styles.input} value={equation?.input} onChange={(e) => onValueChange(e.target.value)}></input>
      </div>
    </>
  );
}
