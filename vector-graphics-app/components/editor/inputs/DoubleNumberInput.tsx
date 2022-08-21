import { Coordinate, Size } from "../../canvas/coordinate.helper";
import Input from "./Input";

export type InputType = 'number' | 'string'

export interface DoubleNumberInputProps {
    labelX: string;
    labelY: string;
    value: Coordinate;
    setValue: (value: Coordinate) => void;
}

export default function DoubleNumberInput({labelX, labelY, value, setValue}: DoubleNumberInputProps) {

    const setX = (x: string) => {
        setValue({x: Number(x), y: value.y});
    }

    const setY = (y: string) => {
        setValue({x: value.y, y: Number(y)});
    }

    return <>
        <Input type="number" label={labelX} value={`${value.x}`} setValue={setX}/>
        <Input type="number" label={labelY} value={`${value.y}`} setValue={setY}/>
    </>
}

export interface CoordinateInputProps {
    coordinate: Coordinate;
    setCoordinate: (value: Coordinate) => void;
}

export function CoordinateInput({coordinate, setCoordinate}: CoordinateInputProps) {
    return <DoubleNumberInput labelX="x" labelY="y" value={coordinate} setValue={setCoordinate} />
}

export interface SizeInputProps {
    size: Size;
    setSize: (value: Size) => void;
}

export function SizeInput({size, setSize}: SizeInputProps) {
    return <DoubleNumberInput labelX="width" labelY="height" value={size} setValue={setSize} />
}
