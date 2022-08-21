import React from 'react';
import { ElementDict } from '../svg/element';

export interface HeaderMenuProps {
  elements: ElementDict;
}

export default function HeaderMenu({ elements }: HeaderMenuProps) {
  return <div>{`Header  ${Object.keys(elements).length}`}</div>;
}
