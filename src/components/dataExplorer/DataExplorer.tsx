import { DataExplorer as DataExplorerType } from 'redux/dataStore/userInterface/dataExplorer';
import { useAppSelector } from 'redux/hooks';
import { getContent } from 'redux/dataStore/userInterface/selectors';
import CoordinateInput from 'components/coordinateInput/CoordinateInput';

export interface DataExplorerProps {
  content: DataExplorerType;
}

export default function DataExplorer({ contentId }: { contentId: string }) {
  const content = useAppSelector(getContent(contentId));
  if (content.type !== 'data') return <div>ERROR</div>;

  return (
    <div>
      <CoordinateInput x={20} y={30} />
    </div>
  );
}
