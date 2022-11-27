import React from 'react';
import { BaseElement } from '../../../redux/dataStore/svg/element';
import { Stroke, updateStroke } from '../../../redux/dataStore/svg/stroke';
import Input from './Input';

export interface StrokeInputProps {
  element: BaseElement;
  updateElement: (updatedElement: BaseElement) => void;
}

export default function StrokeInput({ element, updateElement }: StrokeInputProps) {
  const valueChange = ({ updates }: { updates: Partial<Stroke> }) => {
    const updatedElement = updateStroke({ element: element, updates: updates });
    updateElement(updatedElement);
  };

  return (
    <>
      <Input
        inputType="number"
        valueType="strokeWidth"
        label="width"
        value={element.stroke?.width || 1}
        setValue={(value) => valueChange({ updates: { width: value } })}
      />
      <Input
        inputType="string"
        valueType="color"
        label="color"
        value={element.stroke?.color || 'undefined'}
        setValue={(value) => updateStroke({ element: element, updates: { color: value } })}
      />
    </>
  );
}
