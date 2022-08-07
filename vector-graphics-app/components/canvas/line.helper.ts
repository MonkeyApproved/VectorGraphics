import { Coordinate } from './coordinate.helper';
import { BaseLineElement } from './element.helper';
import { ContainerSelection } from './group.helper';

export interface Line extends BaseLineElement<SVGLineElement> {
    type: 'line';
    start: Coordinate;
    end: Coordinate;
}

export function drawLine(container: ContainerSelection, line: Line) {
    const selection = line.ref ? line.ref : container.append('line');
    line.ref = selection
        .style('stroke', line.stroke.color)
        .style('stroke-width', line.stroke.width)
        .attr('x1', line.start.x)
        .attr('y1', line.start.y)
        .attr('x2', line.end.x)
        .attr('y2', line.end.y);
}
