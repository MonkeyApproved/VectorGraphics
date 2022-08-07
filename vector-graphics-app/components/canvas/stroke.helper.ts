import * as d3 from 'd3';
import { Circle } from './circle.helper';
import { Group } from './group.helper';
import { Rect } from './rect.helper';

export const defaultStrokeStyle: StrokeStyle = {
    color: 'black',
    opacity: 1,
    width: 1,
};

export interface StrokeStyle {
    color: string;
    opacity: number;
    width: number;
    lineJoin?: "miter" | "round" | "bevel"; // style of line connections (pointy, round or squared-off)
    miterLimit?: number; // in case of lineJoin: "miter", this defines at which point we switch to squared-off
    lineCap?: "butt" | "round" | "square"; // line endings
    dashArray?: number[];
    dashOffset?: number;
}


export type StrokeElement = Rect | Circle | Group;

export function setElementStroke(stroke: StrokeStyle, elementId: string) {
    console.log(`setting stroke ${stroke.width} on #${elementId}`)
    d3.select(`#${elementId}`)
        .style('stroke', stroke.color)
        .style('stroke-width', stroke.width);
}
