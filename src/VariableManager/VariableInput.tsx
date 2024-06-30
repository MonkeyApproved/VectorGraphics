import { Equation } from 'src/redux/types';
import styles from './styles.module.css';
import { useState } from 'react';
import { getVariableManagerEquation, useAppSelector } from 'src/redux/selectors';
import { renameEquation, updateEquationValue, useAppDispatch } from 'src/redux/reducers';

export interface VariableInputProps {
  variableName: string;
  index: number;
}

export default function VariableInput({ variableName, index }: VariableInputProps) {
  const equation: Equation = useAppSelector((state) => getVariableManagerEquation(state, variableName));
  const [currentName, setCurrentName] = useState<string>(equation.context.name);
  const [currentValue, setCurrentValue] = useState<string>(equation.input || '');
  const dispatch = useAppDispatch();

  const onNameSubmit = () => {
    dispatch(renameEquation({ oldContext: equation.context, newName: currentName }));
  };

  const onValueSubmit = () => {
    dispatch(updateEquationValue({ context: equation.context, value: currentValue }));
  };

  return (
    <>
      <div
        id={`variable-name-${variableName}}`}
        key={`variable-name-${variableName}}`}
        className={styles.inputWrapper}
        style={{ gridColumn: 1, gridRow: index + 2 }}
      >
        <div id={`variable-name-display-${variableName}}`} className={styles.result}>
          {equation.context.name}
        </div>
        <input
          id={`variable-name-input-${variableName}}`}
          className={styles.input}
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          onBlur={() => onNameSubmit()}
        />
      </div>
      <div
        id={`variable-value-${variableName}}`}
        key={`variable-value-${variableName}`}
        className={styles.inputWrapper}
        style={{ gridColumn: 2, gridRow: index + 2 }}
      >
        <div id={`variable-value-display-${variableName}}`} className={styles.result}>
          {equation.result || 'undefined'}
        </div>
        <input
          id={`variable-value-input-${variableName}}`}
          className={styles.input}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => onValueSubmit()}
        />
      </div>
    </>
  );
}
