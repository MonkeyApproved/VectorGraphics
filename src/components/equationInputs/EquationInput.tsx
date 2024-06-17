import { CSSProperties, useState } from 'react';
import { TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { submitEquation, updateElementProperty } from 'redux/dataStore/dataSlice';
import { getEquationById } from 'redux/math/selectors';
import { SvgProperty } from 'redux/dataStore/svg/context';

export interface EquationInputProps {
  equationId: string;
  svgProperty?: SvgProperty;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function EquationInput(props: EquationInputProps) {
  // input field state
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // equation id state (can be modified by click on text which opens a modal)
  const equation = useAppSelector(getEquationById(props.equationId));

  if (!equation) {
    // equation does not exist yet -> add it to the store with empty string as initial value
    dispatch(submitEquation({ id: props.equationId, input: '' }));
  }

  const onValueChange = (newValue: string) => {
    if (newValue === equation?.input) return;
    if (!props.svgProperty) {
      dispatch(submitEquation({ id: props.equationId, input: newValue }));
    } else {
      dispatch(updateElementProperty({ property: props.svgProperty, value: newValue }));
    }
  };

  const getDisplayValue = () => {
    if (!equation?.input) return '';
    if (hover) return equation.input;
    if (focus) return equation.input;
    if (equation.errorMessage) return equation.input;
    if (equation.result) return equation.result;
    return equation.lastValidNumber;
  };

  return (
    <TextField
      className={props.className}
      style={props.style}
      label={'equation'}
      error={!!equation?.errorMessage}
      helperText={equation?.errorMessage}
      value={getDisplayValue()}
      onChange={(e) => onValueChange(e.target.value)}
      margin="dense"
      size="small"
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      id={`equation-input-${props.equationId}`}
    />
  );
}
