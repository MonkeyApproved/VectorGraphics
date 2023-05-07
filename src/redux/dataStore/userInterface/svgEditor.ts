import { MainContent, NewContentFunction, getContentId } from './content';

export interface SvgEditor extends MainContent {
  type: 'canvas';
  elementIds: string[];
}

export function getNewSvgEditor({ label, containerId }: NewContentFunction): SvgEditor {
  return {
    id: getContentId({ type: 'canvas' }),
    containerId: containerId,
    type: 'canvas',
    label: label,
    elementIds: [],
  };
}
