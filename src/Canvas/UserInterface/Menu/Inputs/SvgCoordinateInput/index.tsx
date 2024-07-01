import styles from './styles.module.css';
import { CSSProperties, useEffect, useState } from 'react';
import cn from 'classnames';
import { addEquation, updateEquationValue, useAppDispatch } from 'src/redux/reducers';
import { SvgCoordinateContext } from 'src/redux/context';
import { getEquationOrUndefined, useAppSelector } from 'src/redux/selectors';

export interface SvgContextInputProps {
  context: SvgCoordinateContext;
  style?: CSSProperties;
  className?: string;
}

export default function SvgCoordinateInput({ context, style, className }: SvgContextInputProps) {
  // current redux state: if equation does not exist yet, add a new one
  const dispatch = useAppDispatch();
  const equation = useAppSelector((state) => getEquationOrUndefined(state, context));

  // component state: current value is used instead of redux state to only update redux once the input looses focus
  const [currentValue, setCurrentValue] = useState<string>('');

  useEffect(() => {
    const initialValue = equation?.input || context.initialValue.toString();
    setCurrentValue(initialValue);
  }, [equation?.input, context.initialValue]);

  const submitValue = () => {
    if (equation === undefined) {
      dispatch(addEquation({ context, value: currentValue }));
    } else {
      dispatch(updateEquationValue({ context, value: currentValue }));
    }
  };

  const id = `${context.namespace}-${context.name}`;

  return (
    <div id={`input-${id}`} key={`input-${id}`} className={cn(styles.inputWrapper, className)} style={style}>
      <div id={`value-${id}`} className={styles.result}>
        {equation?.result || currentValue}
      </div>
      <input
        id={`input-${id}`}
        className={styles.input}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={() => submitValue()}
      />
    </div>
  );
}
