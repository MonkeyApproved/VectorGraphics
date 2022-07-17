import * as d3 from 'd3';
import { useState, useEffect } from 'react';
import styles from '../../styles/SvgCanvas.module.css';
import { drawGroup, Element, Group } from './group.helper';
import { defaultRectStyle } from './rect.helper';

export interface SvgCanvasProps {
    elements: Element[];
}

export default function SvgCanvas({elements}: SvgCanvasProps) {
    const [svgRef, setSvgRef] = useState<SVGSVGElement | undefined>(undefined);

    useEffect(() => {
        if (svgRef) {
            const selection = d3.select(svgRef);
            const mainGroup: Group = {
                type: 'group',
                transformations: [],
                style: {...defaultRectStyle, fill: 'white'},
                elements: elements,
            }
            drawGroup(selection, mainGroup);
        }
      }, [svgRef, elements]);

    return (
    <>
      <div>SVG canvas</div>
      <svg
        className={styles.canvas}
        ref={(ref: SVGSVGElement) => setSvgRef(ref)}
        viewBox="0 0 100 100"
      ></svg>
      </>
    )
  }