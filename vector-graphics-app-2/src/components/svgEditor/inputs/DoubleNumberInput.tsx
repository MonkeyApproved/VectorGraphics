import { Coordinate } from 'redux/dataStore/svg/coordinate';
import Input from './Input';

export type InputType = 'number' | 'string';

export interface DoubleNumberInputProps {
  labelX: string;
  labelY: string;
  value: Coordinate;
  setValue: (value: Coordinate) => void;
}

export default function DoubleNumberInput({ labelX, labelY, value, setValue }: DoubleNumberInputProps) {
  const setX = (x: number) => {
    setValue({ x: x, y: value.y });
  };

  const setY = (y: number) => {
    setValue({ x: value.x, y: y });
  };

  return (
    <>
      <Input inputType="number" valueType="position" label={labelX} value={value.x} setValue={setX} />
      <Input inputType="number" valueType="position" label={labelY} value={value.y} setValue={setY} />
    </>
  );
}
