import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { ElementDict, mapElements } from 'redux/dataStore/svg/elementDict';
import { selectSingleElement } from 'redux/dataStore/dataSlice';
import { getElementDict, getSelectedElementIds } from 'redux/dataStore/svg/selectors';

export default function SelectSingleElementDropdown() {
  const elementDict: ElementDict = useAppSelector(getElementDict);
  const dispatch = useAppDispatch();
  const selectedElementIds = useAppSelector(getSelectedElementIds);

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
        value={selectedElementIds[0] || ''}
        onChange={handleElementSelectionChange}
        disabled={Object.keys(elementDict).length === 0}
      >
        {mapElements<JSX.Element>({
          dict: elementDict,
          func: (element) => {
            return (
              <MenuItem key={`element_select_${element.id}`} value={element.id}>
                {element.id}
              </MenuItem>
            );
          },
        })}
      </Select>
    </FormControl>
  );
}
