import { CSSProperties } from 'react';
import { TextField } from '@mui/material';
import { SvgProperty, getSvgPropertyEquationId } from 'redux/dataStore/svg/context';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getSvgPropertyValue } from 'redux/dataStore/svg/selectors';
import { updateElementProperty } from 'redux/dataStore/dataSlice';

export interface NumberInputProps {
  svgProperty: SvgProperty;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function NumberInput(props: NumberInputProps) {
  const dispatch = useAppDispatch();
  const value = useAppSelector(getSvgPropertyValue(props.svgProperty));

  const onValueChange = (newValue: string) => {
    if (newValue === value && isNaN(Number(newValue))) return;
    dispatch(updateElementProperty({ property: props.svgProperty, value: newValue, lastValidNumber: Number(value) }));
  };

  return (
    <TextField
      className={props.className}
      style={props.style}
      label={props.label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      margin="dense"
      size="small"
      id={`number-input-${getSvgPropertyEquationId({ property: props.svgProperty })}`}
    />
  );
}
