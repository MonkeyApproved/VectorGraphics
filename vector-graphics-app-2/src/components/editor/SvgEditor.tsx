import { Button, Grid } from '@mui/material';
import cn from 'classnames';

import styles from '../../styles/SvgEditor.module.css';
import SvgCanvas from './SvgCanvas';
import { drawElement, getNewElement } from '../svg/element';

export default function SvgEditor() {
  const svgId = 'svgCanvas';

  const addElement = () => {
    const newElement = getNewElement({
      type: 'line',
      position: { x: 0, y: 0 },
      size: { x: 20, y: 20 },
      stroke: {
        color: 'blue',
        width: 5,
      },
      enableDrag: true,
    });
    drawElement({ element: newElement, containerId: svgId });
  };

  return (
    <div className={styles.container}>
      <Grid container rowSpacing={0} columnSpacing={0}>
        <Grid item xs={12} md={12} className={styles.topRow}>
          <div>Header</div>
        </Grid>
        <Grid item xs={6} md={2} className={cn(styles.middleRow, styles.leftMenu)}>
          <Button variant="outlined" onClick={() => addElement()}>
            Click me
          </Button>
        </Grid>
        <Grid item xs={6} md={10} className={styles.middleRow}>
          <SvgCanvas svgId={svgId} viewBox="0 0 100 100" />
        </Grid>
        <Grid item xs={12} md={12} className={styles.bottomRow}>
          <div>Footer</div>
        </Grid>
      </Grid>
    </div>
  );
}
