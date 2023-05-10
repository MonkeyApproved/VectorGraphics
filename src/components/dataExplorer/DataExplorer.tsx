import { DataExplorer as DataExplorerType } from 'redux/dataStore/userInterface/dataExplorer';
import { useAppSelector } from 'redux/hooks';
import { getContent } from 'redux/dataStore/userInterface/selectors';

export interface DataExplorerProps {
  content: DataExplorerType;
}

export default function DataExplorer({ contentId }: { contentId: string }) {
  const content = useAppSelector(getContent(contentId));
  if (content.type !== 'data') return <div>ERROR</div>;

  return <div>{content.id}</div>;
}
