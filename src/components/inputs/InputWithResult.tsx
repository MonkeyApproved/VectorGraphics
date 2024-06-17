import React from 'react';
import cssStyles from './InputWithResult.module.css';
import cn from 'classnames';
import { Result } from 'redux/math/mathSlice';

export interface InputWithResultStyles {
  wrapperClass?: string;
  wrapperStyles?: React.CSSProperties;
  resultClass?: string;
  resultStyles?: React.CSSProperties;
  inputClass?: string;
  inputStyles?: React.CSSProperties;
}

export interface InputWithResultProps {
  result: Result | string;
  value: string;
  onValueChange: (newValue: string) => void;
  key?: string;
  styles?: InputWithResultStyles;
}

export default function InputWithResult({ value, result, onValueChange, key, styles }: InputWithResultProps) {
  return (
    <div key={key} className={cn(cssStyles.inputWrapper, styles?.wrapperClass)} style={styles?.wrapperStyles}>
      <div className={cn(cssStyles.result, styles?.resultClass)} style={styles?.resultStyles}>
        {result}
      </div>
      <input
        className={cn(cssStyles.input, styles?.inputClass)}
        style={styles?.inputStyles}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      ></input>
    </div>
  );
}
