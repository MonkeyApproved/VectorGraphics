import { BaseContent } from 'src/redux/userInterface';

export const DATA_EXPLORER_CONTENT_TYPE = 'dataExplorer';

export interface DataExplorerContent extends BaseContent {
  type: typeof DATA_EXPLORER_CONTENT_TYPE;
}
