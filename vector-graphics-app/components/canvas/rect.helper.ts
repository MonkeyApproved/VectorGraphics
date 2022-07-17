import * as d3 from 'd3';
import { ContainerSelection } from './group.helper';
import { LineStyle } from './line.helper.';

export const defaultRectStyle: RectStyle = {
    color: 'black',
    opacity: 1,
    width: 1,
    fill: '#222222',
}

export interface RectStyle extends LineStyle {
    fill: string;
}

export interface Rect {
    type: 'rect';
    style: RectStyle;
    x: number;
    y: number;
    width: number;
    height: number;
    ref?: d3.Selection<SVGRectElement, unknown, null, undefined>;
}

export function drawRect(container: ContainerSelection, rect: Rect) {
    const selection = rect.ref ? rect.ref : container.append('rect');
    rect.ref = selection
        .style('stroke', rect.style.color)
        .style('stroke-width', rect.style.width)
        .style('fill', rect.style.fill)
        .attr("x", rect.x)
        .attr("y", rect.y)
        .attr("width", rect.width)
        .attr("height", rect.height)
}