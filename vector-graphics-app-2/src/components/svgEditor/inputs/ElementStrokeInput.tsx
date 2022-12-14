import { BaseElement } from '../../../redux/dataStore/svg/element';
import { useAppDispatch } from '../../../redux/hooks';
import { Stroke } from '../../../redux/dataStore/svg/stroke';
import Input from './Input';
import { updateElementStroke } from '../../../redux/dataStore/dataSlice';

export default function ElementStrokeInput({ element }: { element: BaseElement }) {
  const dispatch = useAppDispatch();
  const handleStrokeChange = ({ updates }: { updates: Partial<Stroke> }) => {
    dispatch(updateElementStroke({ elementId: element.id, updates: updates }));
  };

  return (
    <>
      <Input
        inputType="number"
        valueType="strokeWidth"
        label="width"
        value={element.stroke?.width || 1}
        setValue={(value) => handleStrokeChange({ updates: { width: value } })}
      />
      <Input
        inputType="string"
        valueType="color"
        label="color"
        value={element.stroke?.color || 'undefined'}
        setValue={(value) => handleStrokeChange({ updates: { color: value } })}
      />
    </>
  );
}
