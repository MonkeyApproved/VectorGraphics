import { BaseContent, GetAvailableContent, GetContent } from 'src/redux/content';
import { DataExplorerState } from './slice';

export const DATA_EXPLORER_CONTENT_TYPE = 'dataExplorer';

export interface DataExplorerContent extends BaseContent {
  type: typeof DATA_EXPLORER_CONTENT_TYPE;
}

export const getDataExplorerContent: GetContent<DataExplorerState> = ({ contentId, state }) => {
  const data = state.dataSets[contentId];
  return {
    type: DATA_EXPLORER_CONTENT_TYPE,
    contentId: data.id,
    label: data.label,
  };
};

export const getAvailableDataExplorers: GetAvailableContent<DataExplorerState> = ({ state }) => {
  return Object.keys(state.dataSets).map((dataId) => {
    return getDataExplorerContent({ contentId: dataId, state });
  });
};
