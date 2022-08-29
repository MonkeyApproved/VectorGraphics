import React from 'react';
import { Stack } from '@mui/material';
import { BaseElementType, ElementDict } from '../svg/element';
import AreaElementInput from './inputs/AreaElementInput';

export interface LeftSideMenuProps {
  elements: ElementDict;
  selectedElementId?: string;
  updateElement: (args: { updatedElement: BaseElementType }) => void;
  addElement: (args: { newElement: BaseElementType }) => void;
  removeElement: (args: { elementId: string }) => void;
}

export default function LeftSideMenu({ elements, selectedElementId, updateElement }: LeftSideMenuProps) {
  if (!selectedElementId || !elements[selectedElementId]) {
    return <></>;
  }
  const selectedElement = elements[selectedElementId];
  if (selectedElement.type === 'group') {
    return <div>Group</div>;
  }
  return (
    <Stack spacing={2}>
      <AreaElementInput element={selectedElement} updateElement={updateElement} />
    </Stack>
  );
}
