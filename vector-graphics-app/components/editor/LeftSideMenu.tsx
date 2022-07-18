import { Card, CardContent, Input, Stack, TextField, Typography } from "@mui/material";
import styles from '../../styles/SvgEditor.module.css';
import { Circle } from "../canvas/circle.helper";
import { Element } from '../canvas/group.helper';
import { Rect } from "../canvas/rect.helper";


export interface CircleItemProps {
    index: number;
    circle: Circle;
}

export const numberInputProps = { inputMode: 'numeric', pattern: '[0-9]*' }

export function CircleItem({index, circle}: CircleItemProps) {
    return <Card variant="outlined">
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                CIRCLE ({index})
            </Typography>
      </CardContent>
      <CardContent>
            <Input type="number" defaultValue={circle.r}/>
      </CardContent>
      <CardContent>
            <Input type="number" defaultValue={circle.x}/>
            <Input type="number" defaultValue={circle.y}/>
      </CardContent>
    </Card>
}

export interface RectItemProps {
    index: number;
    rect: Rect;
}

export function RectItem({index, rect}: RectItemProps) {
    return <Card variant="outlined">
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                RECTANGLE ({index})
            </Typography>
      </CardContent>
      <CardContent>
        <Input type="number" defaultValue={rect.x} />
        <Input type="number" defaultValue={rect.y} />
      </CardContent>
      <CardContent>
      <Input type="number" defaultValue={rect.width} />
        <Input type="number" defaultValue={rect.height} />
      </CardContent>
    </Card>
}

export interface ItemProps {
    index: number;
    element: Element;
}

export function Item({index, element}: ItemProps) {
    if (element.type === 'circle') {
        return <CircleItem index={index} circle={element} />
    } else if (element.type === "rect") {
        return <RectItem index={index} rect={element} />
    }
    return <></>;
}

export interface LeftSideMenuProps {
    elements: Element[];
}

export default function LeftSideMenu({elements}: LeftSideMenuProps) {
    return (
        <Stack spacing={2}>
            {elements.map((element, index) => <Item index={index} element={element} key={`element_${index}`} />)}
        </Stack>
    );
}