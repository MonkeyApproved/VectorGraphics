import React, { Dispatch, SetStateAction } from 'react';

export type ReactMouseEvent<Element = SVGElement | HTMLElement> = React.MouseEvent<Element, MouseEvent>;
export type ReactSetState<T> = Dispatch<SetStateAction<T>>;
