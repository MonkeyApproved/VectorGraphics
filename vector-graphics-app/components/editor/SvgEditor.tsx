import { Grid } from '@mui/material';
import cn from 'classnames';
import { useState } from 'react';

import styles from '../../styles/SvgEditor.module.css';
import { Element, ElementDict } from '../canvas/element.helper';
import SvgCanvas from '../canvas/SvgCanvas';
import LeftSideMenu from './LeftSideMenu';
import { sampleElements } from './testData';

export default function SvgEditor() {
    const [elementList, setElementList] = useState<ElementDict>(sampleElements)

    const elementChange = (updatedElement: Element, changedProperty: keyof Element) => {
        console.log(`updated ${changedProperty} in ${updatedElement.type} (${updatedElement.id})`);
        const updatedElementList = {...elementList};
        updatedElementList[updatedElement.id] = updatedElement;
        setElementList(updatedElementList);
    }


    return (
    <div className={styles.container}>
        <Grid container rowSpacing={0} columnSpacing={0}>
            <Grid item xs={12} md={12} className={styles.topRow}>
                <div>Header</div>
            </Grid>
            <Grid item xs={6} md={2} className={cn(styles.middleRow, styles.leftMenu)}>
                <LeftSideMenu elements={elementList} />
            </Grid>
            <Grid item xs={6} md={10} className={styles.middleRow}>
                <SvgCanvas elements={elementList} />
            </Grid>
            <Grid item xs={12} md={12} className={styles.bottomRow}>
                <div>Footer</div>
            </Grid>
        </Grid>
    </div>);
}
