import { CSSProperties, useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { submitEquation } from '../../redux/dataStore/dataSlice';
import { selectEquationById } from '../../redux/dataStore/dataSelectors';

export interface EquationInputProps {
  equationId: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function EquationInput(props: EquationInputProps) {
  // input field state
  const [hover, setHover] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);

  // equation id state (can be modified by click on text which opens a modal)
  const defaultValue = '';
  const equation = useAppSelector(selectEquationById(props.equationId));

  useEffect(() => {
    dispatch(submitEquation({ id: props.equationId, input: defaultValue }));
  }, []);

  const dispatch = useAppDispatch();

  const onValueChange = (newValue: string) => {
    if (newValue !== equation?.input) {
      dispatch(submitEquation({ id: props.equationId, input: newValue }));
    }
  };

  const getDisplayValue = () => {
    if (!equation?.input) return '';
    if (hover) return equation.input;
    if (focus) return equation.input;
    if (equation.errorMessage) return equation.input;
    return equation.result;
  };

  return (
    <>
      <TextField
        className={props.className}
        style={props.style}
        label={props.label}
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalculateIcon />
            </InputAdornment>
          ),
        }}
        id={`equation-input-${props.equationId}`}
      />
    </>
  );
}
