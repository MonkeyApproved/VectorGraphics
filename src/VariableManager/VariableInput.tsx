import styles from './styles.module.css';
import { useState } from 'react';
import { Equation, useAppDispatch, useAppSelector, getVariableManagerEquation, updateEquationValue } from 'src/redux';

export interface VariableInputProps {
  variableName: string;
  index: number;
}

export default function VariableInput({ variableName, index }: VariableInputProps) {
  const equation: Equation = useAppSelector(getVariableManagerEquation({ variableName }));
  const [currentName, setCurrentName] = useState<string>(equation.context.name);
  const [currentValue, setCurrentValue] = useState<string>(equation.input || '');
  const dispatch = useAppDispatch();

  const onNameSubmit = (newName: string) => {
    console.log(`Variable name changed from ${currentName} to ${newName}`);
  };

  const onValueSubmit = (newValue: string) => {
    dispatch(updateEquationValue({ context: equation.context, value: newValue }));
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
          id={`variable-name-display-${variableName}}`}
          className={styles.input}
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          onBlur={(e) => onNameSubmit(e.target.value)}
        />
      </div>
      <div
        id={`variable-value-${variableName}}`}
        key={`variable-value-${index}`}
        className={styles.inputWrapper}
        style={{ gridColumn: 2, gridRow: index + 2 }}
      >
        <div id={`variable-value-display-${variableName}}`} className={styles.result}>
          {equation.result || 'undefined'}
        </div>
        <input
          id={`variable-value-input-${variableName}}`}
          className={styles.input}
          value={equation.input}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={(e) => onValueSubmit(e.target.value)}
        />
      </div>
    </>
  );
}
