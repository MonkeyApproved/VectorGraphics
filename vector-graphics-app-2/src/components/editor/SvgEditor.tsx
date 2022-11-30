import { Button, Grid } from '@mui/material';
import cn from 'classnames';

import styles from '../../styles/SvgEditor.module.css';
import SvgCanvas from './SvgCanvas';
import { useAppDispatch } from '../../redux/hooks';
import { addElement, addEquation, selectSingleElement } from '../../redux/dataStore/dataSlice';
import { sampleLine, sampleRect } from './testData';
import LeftSideMenu from './LeftSideMenu';
import Input from './inputs/Input';
import { useState } from 'react';

export default function SvgEditor() {
  const [equation, setEquation] = useState<string>('');
  const [id, setId] = useState<string>('');
  const svgId = 'svgCanvas';
  const dispatch = useAppDispatch();

  return (
    <div className={styles.container}>
      <Grid container rowSpacing={0} columnSpacing={0}>
        <Grid item xs={12} md={12} className={styles.topRow}>
          <Button variant="outlined" onClick={() => dispatch(addElement({ element: sampleRect }))}>
            Add Rect
          </Button>
          <Button variant="outlined" onClick={() => dispatch(addElement({ element: sampleLine }))}>
            Add Line
          </Button>
          <Input inputType="string" valueType="label" label="equation" value={equation} setValue={setEquation} />
          <Input inputType="string" valueType="label" label="id" value={id} setValue={setId} />
          <Button variant="outlined" onClick={() => dispatch(addEquation({ id, equation }))}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={6} md={2} className={cn(styles.middleRow, styles.leftMenu)}>
          <LeftSideMenu />
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
