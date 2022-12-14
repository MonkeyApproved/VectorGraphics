import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectElementDict, selectSelectedElementId } from '../../../redux/dataStore/dataSelectors';
import { ElementDict, mapElements } from '../../../redux/dataStore/svg/elementDict';
import { selectSingleElement } from '../../../redux/dataStore/dataSlice';

export default function SingleElementSelector() {
  const elementDict: ElementDict = useAppSelector(selectElementDict);
  const dispatch = useAppDispatch();
  const selectedElementId: string | undefined = useAppSelector(selectSelectedElementId);

  const handleElementSelectionChange = (event: SelectChangeEvent) => {
    if (event.target.value !== '') {
      dispatch(selectSingleElement({ elementId: event.target.value }));
    }
  };

  return (
    <FormControl variant="standard">
      <InputLabel id="demo-simple-select-label">Element</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Element"
        value={selectedElementId || ''}
        onChange={handleElementSelectionChange}
        disabled={Object.keys(elementDict).length === 0}
      >
        {mapElements<JSX.Element>({
          dict: elementDict,
          func: (element) => {
            return (
              <MenuItem key={`element_select_${element.id}`} value={element.id}>
                {element.type}
              </MenuItem>
            );
          },
        })}
      </Select>
    </FormControl>
  );
}
