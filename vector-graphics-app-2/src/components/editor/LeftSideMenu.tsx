import React from 'react';
import { Stack } from '@mui/material';
import { BaseElementType, ElementDict, mapElements } from '../svg/element';
import AreaElementInput from './inputs/AreaElementInput';

export interface LeftSideMenuProps {
  elements: ElementDict;
  updateElement: (args: { updatedElement: BaseElementType }) => void;
  addElement: (args: { newElement: BaseElementType }) => void;
  removeElement: (args: { elementId: string }) => void;
}

export default function LeftSideMenu({ elements, updateElement }: LeftSideMenuProps) {
  return (
    <Stack spacing={2}>
      {mapElements<JSX.Element>(elements, (element, index) => {
        if (element.type === 'rect') {
          return (
            <div key={`leftMenu_${index}`}>
              <AreaElementInput element={element} updateElement={updateElement} />
            </div>
          );
        }
        return <div key={`leftMenu_${index}`} />;
      })}
    </Stack>
  );
}
