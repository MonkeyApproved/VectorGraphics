import { Size } from './coordinate.helper';
import { BaseAreaElement } from './element.helper';
import { ContainerSelection } from './group.helper';

export interface Rect extends BaseAreaElement<SVGRectElement> {
    type: 'rect';
    size: Size;
}

export function drawRect(container: ContainerSelection, rect: Rect) {
    const selection = rect.ref ? rect.ref : container.append('rect');
    rect.ref = selection
        .style('stroke', rect.stroke.color)
        .style('stroke-width', rect.stroke.width)
        .style('fill', rect.fill.color)
        .attr("id", rect.id)
        .attr("x", rect.position.x)
        .attr("y", rect.position.y)
        .attr("width", rect.size.x)
        .attr("height", rect.size.y)
}
