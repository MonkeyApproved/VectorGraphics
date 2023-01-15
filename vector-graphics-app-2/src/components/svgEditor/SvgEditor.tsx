import { Grid } from '@mui/material';
import cn from 'classnames';

import styles from './SvgEditor.module.css';
import SvgCanvas from './SvgCanvas';
import LeftSideMenu from './LeftSideMenu';
import HeaderMenu from './HeaderMenu';

export default function SvgEditor() {
  const canvasId = 'mainCanvas';
  const bottomCanvasId = 'bottomCanvas';

  return (
    <div className={styles.container}>
      <Grid container rowSpacing={0} columnSpacing={0}>
        <Grid item xs={12} md={12} className={styles.topRow}>
          <HeaderMenu />
        </Grid>
        <Grid item xs={6} md={2} className={cn(styles.middleRow, styles.leftMenu)}>
          <LeftSideMenu />
        </Grid>
        <Grid item xs={6} md={10} className={styles.middleRow}>
          <SvgCanvas canvasId={canvasId} bottomCanvasId={bottomCanvasId} viewBox="0 0 100 100" />
        </Grid>
        <Grid item xs={12} md={12} className={styles.bottomRow}>
          <div>Footer</div>
        </Grid>
      </Grid>
    </div>
  );
}
