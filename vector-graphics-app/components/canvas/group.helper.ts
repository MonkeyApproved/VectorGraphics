import * as d3 from 'd3';
import { Circle, drawCircle } from './circle.helper';
import { drawLine, Line } from './line.helper';
import { drawRect, Rect, RectStyle } from './rect.helper';

export type Element = Line | Rect | Circle | Group;

export interface Rotation {
    type: 'rotate';
    angle: number;
    x: number;
    y: number;
}

export interface Translation {
    type: 'translate';
    x: number;
    y: number;
}

export interface Scale {
    type: 'scale';
    x: number;
    y: number;
}

export interface Skew {
    type: 'skew';
    direction: 'x' | 'y';
    factor: number;
}

export type Transformation = Rotation | Translation | Scale | Skew;

export interface Group {
    type: 'group';
    transformations: Transformation[];
    style: RectStyle;
    elements: Element[];
    ref?: d3.Selection<SVGGElement, unknown, null, undefined>;
}

export type GroupSelection = d3.Selection<SVGGElement, unknown, null, undefined>;
export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type ContainerSelection = GroupSelection | SvgSelection;

export function drawGroup(container: ContainerSelection, group: Group) {
    const selection = group.ref ? group.ref : container.append('g');
    group.ref = selection
        .style('stroke', group.style.color)
        .style('stroke-width', group.style.width)
        .style('fill', group.style.fill)

    group.elements.forEach((element) => {
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