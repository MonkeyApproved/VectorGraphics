import { setElementStroke, StrokeStyle } from "../../canvas/stroke.helper";
import Input from "./Input";

export interface StrokeInputProps {
    stroke: StrokeStyle;
    setStroke: (value: StrokeStyle) => void;
    elementId: string;
}

export default function StrokeInput({stroke, setStroke, elementId}: StrokeInputProps) {

    const setWidth = (width: string) => {
        console.log(`new width: ${width}`)
        const newStroke = {...stroke, width: Number(width)};
        setElementStroke(newStroke, elementId);
        setStroke(newStroke);
    }

    const setColor = (color: string) => {
        setStroke({...stroke, color});
    }

    return <>
        <Input type="number" label="width" value={`${stroke.width}`} setValue={setWidth}/>
        <Input type="string" label="color" value={`${stroke.color}`} setValue={setColor}/>
    </>
}
