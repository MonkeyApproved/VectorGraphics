import { MainContent, NewContentFunction, getContentId } from './content';

export interface DataExplorer extends MainContent {
  type: 'data';
  dataId?: string;
}

export function getNewDataExplorer({ label, containerId }: NewContentFunction): DataExplorer {
  return {
    id: getContentId({ type: 'data' }),
    containerId: containerId,
    type: 'data',
    label: label,
  };
}
