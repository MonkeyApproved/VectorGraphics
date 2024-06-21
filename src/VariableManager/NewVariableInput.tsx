import styles from './styles.module.css';
import { useState } from 'react';
import { addEquation, useAppDispatch } from 'src/redux/reducers';
import { getVariableManagerContext } from 'src/redux/utils';
import { addVariableToVariableManager } from 'src/redux/variableManager/slice';

export default function NewVariableInput({ managerId, index }: { managerId: string; index: number }) {
  const [currentName, setCurrentName] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');
  const dispatch = useAppDispatch();

  const submitVariable = () => {
    if (currentName === '' || currentValue === '') return;
    // submit this variable to math slice
    dispatch(addEquation({ context: getVariableManagerContext({ name: currentName }), value: currentValue }));
    // add the variable to the variable manager
    dispatch(addVariableToVariableManager({ managerId, variableName: currentName }));
    // reset internal state
    setCurrentName('');
    setCurrentValue('');
  };

  return (
    <>
      <div
        id={`variable-new-name`}
        key={`variable-new-name`}
        className={styles.inputWrapper}
        style={{ gridColumn: 1, gridRow: index + 2 }}
      >
        <div id={`variable-new-name-display`} className={styles.result}>
          {currentName}
        </div>
        <input
          id={`variable-new-name-input`}
          className={styles.input}
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          onBlur={() => submitVariable()}
        />
      </div>
      <div
        id={`variable-new-value`}
        key={`variable-new-value`}
        className={styles.inputWrapper}
        style={{ gridColumn: 2, gridRow: index + 2 }}
      >
        <div id={`variable-new-value-display`} className={styles.result}>
          {currentValue}
        </div>
        <input
          id={`variable-new-value-input`}
          className={styles.input}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => submitVariable()}
        />
      </div>
    </>
  );
}
