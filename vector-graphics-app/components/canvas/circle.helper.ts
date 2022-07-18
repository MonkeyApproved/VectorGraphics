import * as d3 from 'd3';
import { ContainerSelection } from './group.helper';
import { LineStyle } from './line.helper';

export const defaultCircleStyle: CircleStyle = {
    color: 'black',
    opacity: 1,
    width: 1,
    fill: '#22ffff',
}

export interface CircleStyle extends LineStyle {
    fill: string;
}

export interface Circle {
    type: 'circle';
    style: CircleStyle;
    x: number;
    y: number;
    r: number;
    ref?: d3.Selection<SVGCircleElement, unknown, null, undefined>;
}

export function drawCircle(container: ContainerSelection, circle: Circle) {
    const selection = circle.ref ? circle.ref : container.append('circle');
    circle.ref = selection
        .style('stroke', circle.style.color)
        .style('stroke-width', circle.style.width)
        .style('fill', circle.style.fill)
        .attr("r", circle.r)
        .attr("cx", circle.x)
        .attr("cy", circle.y);
}