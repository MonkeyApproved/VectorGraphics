import { BaseAreaElement } from './element.helper';
import { ContainerSelection } from './group.helper';
import { StrokeStyle } from "./stroke.helper";

export const defaultCircleStyle: CircleStyle = {
    color: 'black',
    opacity: 1,
    width: 1,
    fill: '#22ffff',
}

export interface CircleStyle extends StrokeStyle {
    fill: string;
}

export interface Circle extends BaseAreaElement<SVGCircleElement> {
    type: 'circle';
    radius: number;
}

export function drawCircle(container: ContainerSelection, circle: Circle) {
    const selection = circle.ref ? circle.ref : container.append('circle');
    circle.ref = selection
        .style('stroke', circle.stroke.color)
        .style('stroke-width', circle.stroke.width)
        .style('fill', circle.fill.color)
        .attr("r", circle.radius)
        .attr("cx", circle.position.x)
        .attr("cy", circle.position.y);
}
