import SvgEditor from 'components/svgEditor/SvgEditor';
import Spreadsheet from 'components/spreadsheet/Spreadsheet';
import VariableTable from 'components/variableTable/VariableTable';
import DataExplorer from 'components/dataExplorer/DataExplorer';
import { AnyContent } from 'redux/dataStore/userInterface/content';

export default function MainContent({ content }: { content: AnyContent }) {
  if (content.type === 'canvas') {
    return <SvgEditor content={content} />;
  } else if (content.type === 'spreadsheet') {
    return <Spreadsheet content={content} />;
  } else if (content.type === 'variables') {
    return <VariableTable content={content} />;
  } else if (content.type === 'data') {
    return <DataExplorer content={content} />;
  }
  return <></>;
}
