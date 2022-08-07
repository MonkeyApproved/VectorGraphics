import * as d3 from 'd3';
import { drawCircle } from './circle.helper';
import { BaseAreaElement, ElementDict, generateId } from './element.helper';
import { defaultFillStyle } from './fill.helper';
import { drawLine } from './line.helper';
import { drawRect } from './rect.helper';
import { defaultStrokeStyle } from './stroke.helper';
import { Transformation } from './transformation.helper';

export interface Group extends BaseAreaElement<SVGGElement> {
    type: 'group';
    transformations: Transformation[];
    elements: ElementDict;
}

export type GroupSelection = d3.Selection<SVGGElement, unknown, null, undefined>;
export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type ContainerSelection = GroupSelection | SvgSelection;

export function createGroup(elements: ElementDict): Group {
    return {
        id: generateId(),
        type: 'group',
        transformations: [],
        position: {x: 0, y: 0},
        stroke: defaultStrokeStyle,
        fill: defaultFillStyle,
        elements: elements,
    }
}

export function drawGroup(container: ContainerSelection, group: Group) {
    const selection = group.ref ? group.ref : container.append('g');
    group.ref = selection
        .style('stroke', group.stroke.color)
        .style('stroke-width', group.stroke.width)
        .style('fill', group.fill.color);

    Object.values(group.elements).forEach((element) => {
        if (element.type === 'line') {
            drawLine(selection, element);
        } else if (element.type === 'rect') {
            drawRect(selection, element);
        } else if (element.type ==='circle') {
            drawCircle(selection, element);
        } else if (element.type === 'group') {
            drawGroup(selection, element);
        }
    })
}
