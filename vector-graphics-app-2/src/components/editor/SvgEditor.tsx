import * as d3 from 'd3';
import { useEffect, useState } from 'react';
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
import { updateHandlersInDict } from '../svg/handlers';

export default function SvgEditor() {
  const onElementClick = ({ elementId }: { elementId: string }) => {
    const element = baseGroup.elements[elementId];
    if (!element) {
      throw new Error('Unknown element for click event');
    }
    setSelectedElementId(elementId);
  };

  const group = createGroup({
    elements: updateHandlersInDict({
      elementDict: sampleElements,
      handlers: { onClick: onElementClick },
    }),
  });
  const [baseGroup, setBaseGroup] = useState<Group>(group);
  const [svg, setSvg] = useState<SVGSVGElement>();
  const [selectedElementId, setSelectedElementId] = useState<string>();

  useEffect(() => {
    // after the svg canvas is set up, we add all elements
    if (svg) {
      const svgRef = d3.select(svg);
      const groupWithRefs = drawGroup({ container: svgRef, group: baseGroup });
      setBaseGroup(groupWithRefs);
    }
  }, [svg]);

  const addElement = ({ newElement }: { newElement: BaseElementType }) => {
    const newGroup = addElementToGroup({ element: newElement, group: baseGroup });
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
            selectedElementId={selectedElementId}
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
