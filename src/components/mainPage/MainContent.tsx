import SvgEditor from 'components/svgEditor/SvgEditor';
import Spreadsheet from 'components/spreadsheet/Spreadsheet';
import VariableTable from 'components/variableTable/VariableTable';
import DataExplorer from 'components/dataExplorer/DataExplorer';
import { useAppSelector } from 'redux/hooks';
import { getContentType } from 'redux/dataStore/userInterface/selectors';

export default function MainContent({ contentId }: { contentId: string | undefined }) {
  if (!contentId) return <></>;

  const contentType = useAppSelector(getContentType(contentId));
  if (contentType === 'canvas') {
    return <SvgEditor contentId={contentId} />;
  } else if (contentType === 'spreadsheet') {
    return <Spreadsheet contentId={contentId} />;
  } else if (contentType === 'variables') {
    return <VariableTable contentId={contentId} />;
  } else if (contentType === 'data') {
    return <DataExplorer contentId={contentId} />;
  }
  return <></>;
}
