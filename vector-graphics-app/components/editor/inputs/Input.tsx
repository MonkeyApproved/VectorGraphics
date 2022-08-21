import { TextField } from "@mui/material";
import { useState } from "react";

export type InputType = 'number' | 'string'

export interface InputProps {
    type: InputType;
    label: string;
    value: string;
    setValue: (value: string) => void;
}

export default function Input({type, label, value, setValue}: InputProps) {
    const [error, setError] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<string>(value);

    const onChange = (newValue: string) => {
        setCurrentValue(newValue);
        validateInputValue({
            inputType: type,
            value: newValue,
            setValue: setValue,
            setError: setError,
        });
    }

    return <TextField
        error={error}
        label={label}
        value={currentValue}
        onChange={(e) => {
            onChange(e.target.value);
        }}
        helperText="Incorrect input"
        variant="filled"
    />
}

export interface ValidationFunctionProps {
    value: string;
    setValue: (value: string) => void;
    setError: (error: boolean) => void;
}

export function validateInputValue(
    {inputType, ...args}: ValidationFunctionProps & {inputType: InputType }
    ) {
        console.log(args);
        if (inputType === 'number') {
            validateNumberInput(args);
        } else if (inputType === 'string') {
            validateStringInput(args);
        }
}

export function validateNumberInput({value, setValue, setError}: ValidationFunctionProps): void {
    const parsedNumber = Number(value);
    if (isNaN(parsedNumber)) {
        setError(true);
    } else {
        setValue(value);
        setError(false);
    }
}

export function validateStringInput({value, setValue, setError}: ValidationFunctionProps): void {
    setValue(value);
    setError(false);
}
