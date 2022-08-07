import { Coordinate } from "../../canvas/coordinate.helper";
import { BaseAreaElement } from "../../canvas/element.helper";
import { CoordinateInput } from "./DoubleNumberInput";

export type InputType = 'number' | 'string'

export interface AreaElementInputProps {
    element: BaseAreaElement<d3.BaseType>;
    setElement: (element: BaseAreaElement<d3.BaseType>) => void
}

export default function AreaElementInput({element, setElement}: AreaElementInputProps) {

    const setPosition = (value: Coordinate) => {
        setElement({...element, position: value});
    }

    return <>
        <CoordinateInput coordinate={element.position} setCoordinate={setPosition} />
    </>
}
