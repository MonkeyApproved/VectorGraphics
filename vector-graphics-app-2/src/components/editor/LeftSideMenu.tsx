import React from 'react';
import { Stack } from '@mui/material';
import { BaseElement } from '../svg/element';
import AreaElementInput from './inputs/AreaElementInput';
import { ElementDict } from '../svg/elementDict';

export interface LeftSideMenuProps {
  elements: ElementDict;
  selectedElementId?: string;
  updateElement: (args: { updatedElement: BaseElement }) => void;
  addElement: (args: { newElement: BaseElement }) => void;
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
