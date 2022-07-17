import * as d3 from 'd3';
import { ContainerSelection } from './group.helper';

export const defaultLineStyle: LineStyle = {
    color: 'black',
    opacity: 1,
    width: 1,
}

export interface LineStyle {
    color: string;
    opacity: number;
    width: number;
    lineJoin?: "miter" | "round" | "bevel";  // style of line connections (pointy, round or squared-off)
    miterLimit?: number;  // in case of lineJoin: "miter", this defines at which point we switch to squared-off
    lineCap?: "butt" | "round" | "square";  // line endings
    dashArray?: number[];
    dashOffset?: number;
}

export interface Line {
    type: 'line';
    style: LineStyle;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    z: number;
    ref?: d3.Selection<SVGLineElement, unknown, null, undefined>;
}

export function drawLine(container: ContainerSelection, line: Line) {
    const selection = line.ref ? line.ref : container.append('line');
    line.ref = selection
        .style('stroke', line.style.color)
        .style('stroke-width', line.style.width)
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', line.x2)
        .attr('y2', line.y2);
}