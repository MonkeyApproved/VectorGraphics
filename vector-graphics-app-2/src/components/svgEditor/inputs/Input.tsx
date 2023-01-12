import { useEffect } from 'react';
import { TextField } from '@mui/material';
import { useState } from 'react';

export type StringValueTypes = 'color' | 'label';
export type NumberValueTypes = 'position' | 'strokeWidth';

export interface StringInputProps {
  inputType: 'string';
  valueType: StringValueTypes;
  label: string;
  value: string;
  setValue: (value: string) => void;
}

export interface NumberInputProps {
  inputType: 'number';
  valueType: NumberValueTypes;
  label: string;
  value: number;
  setValue: (value: number) => void;
}

export default function Input({ inputType, valueType, label, value, setValue }: StringInputProps | NumberInputProps) {
  const [error, setError] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>(`${value}`);

  useEffect(() => {
    setCurrentValue(`${value}`);
  }, [value]);

  const onChange = (newValue: string) => {
    setCurrentValue(newValue);
    if (inputType === 'string') {
      validateStringInput({
        valueType: valueType,
        value: newValue,
        setValue: setValue,
        setError: setError,
      });
    } else if (inputType === 'number') {
      validateNumberInput({
        valueType: valueType,
        value: newValue,
        setValue: setValue,
        setError: setError,
      });
    }
  };

  return (
    <TextField
      error={error}
      label={label}
      value={currentValue}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      variant="filled"
    />
  );
}

export interface ValidationNumberInputProps {
  value: string;
  valueType: NumberValueTypes;
  setValue: (value: number) => void;
  setError: (error: boolean) => void;
}

export function validateNumberInput({ value, setValue, setError }: ValidationNumberInputProps): void {
  const parsedNumber = Number(value);
  if (isNaN(parsedNumber)) {
    setError(true);
  } else {
    setValue(parsedNumber);
    setError(false);
  }
}

export interface ValidationStringInputProps {
  value: string;
  valueType: StringValueTypes;
  setValue: (value: string) => void;
  setError: (error: boolean) => void;
}

export function validateStringInput({ value, valueType, setValue, setError }: ValidationStringInputProps): void {
  if (valueType === 'color') {
    // to do: check that color input is valid
    setValue(value);
    setError(false);
  } else {
    setValue(value);
    setError(false);
  }
}
