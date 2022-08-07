import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import styles from '../../styles/SvgCanvas.module.css';
import { ElementDict } from './element.helper';
import { createGroup, drawGroup, Group } from './group.helper';

export interface SvgCanvasProps {
    elements: ElementDict;
}

export default function SvgCanvas({elements}: SvgCanvasProps) {
    const [svgRef, setSvgRef] = useState<SVGSVGElement | undefined>(undefined);

    useEffect(() => {
        if (svgRef) {
            const selection = d3.select(svgRef);
            const mainGroup: Group = createGroup(elements);
            drawGroup(selection, mainGroup);
        }
      }, [svgRef, elements]);

    return <svg
        className={styles.canvas}
        ref={(ref: SVGSVGElement) => setSvgRef(ref)}
        viewBox="0 0 100 100"
      />

  }
