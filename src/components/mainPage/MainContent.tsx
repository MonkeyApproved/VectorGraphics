import { useAppSelector } from 'redux/hooks';
import { getMainContent } from 'redux/dataStore/userInterface/selectors';
import SvgEditor from 'components/svgEditor/SvgEditor';
import Spreadsheet from 'components/equationInputs/Spreadsheet';
import VariableTable from 'components/equationInputs/VariableTable';

export default function MainContent({ id }: { id: string }) {
  const content = useAppSelector(getMainContent(id));

  if (!content) {
    return <></>;
  } else if (content.type === 'canvas') {
    return <SvgEditor content={content} />;
  } else if (content.type === 'spreadsheet') {
    return <Spreadsheet content={content} />;
  } else if (content.type === 'variables') {
    return <VariableTable content={content} />;
  }
  return <div>Unknown Content: {content.type}</div>;
}
