import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Coordinate } from "../canvas/coordinate.helper";
import { Element, ElementDict, mapElements } from "../canvas/element.helper";
import { Rect } from "../canvas/rect.helper";
import { StrokeStyle } from "../canvas/stroke.helper";
import DoubleNumberInput from "./inputs/DoubleNumberInput";
import StrokeInput from "./inputs/StrokeInput";

export interface RectItemProps {
    rect: Rect;
}

export function RectMenu({rect}: RectItemProps) {
    const [position, setPosition] = useState<Coordinate>(rect.position);
    const [stroke, setStroke] = useState<StrokeStyle>(rect.stroke);

    return <Card variant="outlined">
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                RECTANGLE ({rect.id})
            </Typography>
      </CardContent>
      <CardContent>
        <DoubleNumberInput labelX="x" labelY="y" value={position} setValue={setPosition}  />
      </CardContent>
      <CardContent>
        <StrokeInput stroke={stroke} setStroke={setStroke} elementId={rect.id} />
      </CardContent>
    </Card>
}

export interface ItemProps {
    element: Element;
}

export function ElementMenu({element}: ItemProps) {
    if (element.type === 'circle') {
        return <></>;
    } else if (element.type === "rect") {
        return <RectMenu rect={element} />
    }
    return <></>;
}

export interface LeftSideMenuProps {
    elements: ElementDict;
}

export default function LeftSideMenu({elements}: LeftSideMenuProps) {
    return (
        <Stack spacing={2}>
            {mapElements(elements, (element) => <ElementMenu element={element} key={`element_${element.id}`} />)}
        </Stack>
    );
}
