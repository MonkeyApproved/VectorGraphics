import { Grid } from '@mui/material';
import cn from 'classnames';

import styles from '../../styles/SvgEditor.module.css';
import SvgCanvas from '../canvas/SvgCanvas';
import LeftSideMenu from './LeftSideMenu';
import { simpleElements } from './testData';

export default function SvgEditor() {
    return (
    <div className={styles.container}>
        <Grid container rowSpacing={0} columnSpacing={0}>
            <Grid item xs={12} md={12} className={styles.topRow}>
                <div>Header</div>
            </Grid>
            <Grid item xs={6} md={2} className={cn(styles.middleRow, styles.leftMenu)}>
                <LeftSideMenu elements={simpleElements} />
            </Grid>
            <Grid item xs={6} md={10} className={styles.middleRow}>
                <SvgCanvas elements={simpleElements} />
            </Grid>
            <Grid item xs={12} md={12} className={styles.bottomRow}>
                <div>Footer</div>
            </Grid>
        </Grid>
    </div>);
}