import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import cn from 'classnames';

import styles from '../../styles/SvgEditor.module.css';
import SvgCanvas from './SvgCanvas';
import LeftSideMenu from './LeftSideMenu';
import { sampleElements } from './testData';
import { BaseElementType } from '../svg/element';
import {
  addElementToGroup,
  createGroup,
  drawGroup,
  Group,
  removeElementFromGroup,
  updateElementInGroup,
} from '../svg/group';
import HeaderMenu from './HeaderMenu';
import { getMouseHandlers, MouseEvent } from '../svg/mouseEvents';
import { subtractCoordinates } from '../svg/coordinate';

export default function SvgEditor() {
  const [svg, setSvg] = useState<SVGSVGElement>();
  const [baseGroup, setBaseGroup] = useState<Group>(createGroup({ elements: {} }));
  const [mouseEvent, setMouseEvent] = useState<MouseEvent>({ status: 'idle' });
  const mouseEventRef = useRef(mouseEvent);
  const handlers = getMouseHandlers({ mouseEventRef, setMouseEvent });

  useEffect(() => {
    // add initial elements
    for (const elementId in sampleElements) {
      addElement({ newElement: sampleElements[elementId] });
    }
  }, []);

  useEffect(() => {
    mouseEventRef.current = mouseEvent;
    if (mouseEvent.status === 'mouseDrag' && mouseEvent.currentPosition && mouseEvent.initialPosition) {
      const offset = subtractCoordinates({ leftArg: mouseEvent.currentPosition, rightArg: mouseEvent.initialPosition });
      mouseEvent.target?.ref?.attr('transform', `translate(${offset.x}, ${offset.y})`);
    }
  }, [mouseEvent]);

  useEffect(() => {
    // after the svg canvas is set up, we add all elements
    if (svg) {
      const svgRef = d3.select(svg);
      const groupWithRefs = drawGroup({ container: svgRef, group: baseGroup });
      setBaseGroup(groupWithRefs);
      setMouseEvent({ status: 'idle', canvas: svgRef });
    }
  }, [svg]);

  const addElement = ({ newElement }: { newElement: BaseElementType }) => {
    // add event handlers to element
    const element = { ...newElement, handlers };

    // add element to base-group
    const newGroup = addElementToGroup({ element, group: baseGroup });
    setBaseGroup(newGroup);
  };

  const removeElement = ({ elementId }: { elementId: string }) => {
    const newGroup = removeElementFromGroup({ elementId, group: baseGroup });
    setBaseGroup(newGroup);
  };

  const updateElement = ({ updatedElement }: { updatedElement: BaseElementType }) => {
    const newGroup = updateElementInGroup({ updatedElement, group: baseGroup });
    setBaseGroup(newGroup);
  };

  return (
    <div className={styles.container}>
      <Grid container rowSpacing={0} columnSpacing={0}>
        <Grid item xs={12} md={12} className={styles.topRow}>
          <HeaderMenu elements={baseGroup.elements} />
        </Grid>
        <Grid item xs={6} md={2} className={cn(styles.middleRow, styles.leftMenu)}>
          <LeftSideMenu
            elements={baseGroup.elements}
            selectedElementId={mouseEvent.target?.id}
            updateElement={updateElement}
            addElement={addElement}
            removeElement={removeElement}
          />
        </Grid>
        <Grid item xs={6} md={10} className={styles.middleRow}>
          <SvgCanvas setSvg={setSvg} viewBox="0 0 100 100" />
        </Grid>
        <Grid item xs={12} md={12} className={styles.bottomRow}>
          <div>Footer</div>
        </Grid>
      </Grid>
    </div>
  );
}
