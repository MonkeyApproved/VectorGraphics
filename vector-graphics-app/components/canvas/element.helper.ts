import * as d3 from 'd3';
import { Circle } from "./circle.helper";
import { Coordinate } from "./coordinate.helper";
import { FillStyle } from "./fill.helper";
import { Group } from "./group.helper";
import { Line } from "./line.helper";
import { Rect } from "./rect.helper";
import { StrokeStyle } from "./stroke.helper";

export function generateId(): string {
    return Math.random().toString(16).slice(2);
}

export type ElementRef<T extends d3.BaseType> = d3.Selection<T, unknown, null, undefined>;

export interface BaseElement<T extends d3.BaseType> {
    id: string;
    type: string;
    ref?: ElementRef<T>;
}

export interface BaseLineElement<T extends d3.BaseType> extends BaseElement<T> {
    stroke: StrokeStyle;
    position: Coordinate;
}

export interface BaseAreaElement<T extends d3.BaseType> extends BaseElement<T> {
    stroke: StrokeStyle;
    fill: FillStyle;
    position: Coordinate;
}

export type Element = Line | Rect | Circle | Group;

export interface ElementDict {
    [id: string] : Element;
}

export function addElement(dict: ElementDict, newElement: Element): ElementDict {
    const id = generateId();
    newElement.id = id;
    dict[id] = newElement;
    return dict;
}

export function removeElement(dict: ElementDict, id: string): ElementDict {
    delete dict[id];
    return dict;
}

export function getElement(dict: ElementDict, id: string): Element {
    return dict[id];
}

export function forEachElement(dict: ElementDict, func: (element: Element) => void): void {
    return Object.values(dict).forEach((element: Element) => func(element))
}

export function mapElements<ReturnType>(dict: ElementDict, func: (element: Element) => ReturnType): ReturnType[] {
    return Object.values(dict).map((element: Element) => func(element));
}
