import SvgEditor from 'components/svgEditor/SvgEditor';
import Spreadsheet from 'components/equationInputs/Spreadsheet';
import VariableTable from 'components/equationInputs/VariableTable';
import { AnyContent } from 'redux/dataStore/userInterface/content';

export default function MainContent({ content }: { content: AnyContent }) {
  if (content.type === 'canvas') {
    return <SvgEditor content={content} />;
  } else if (content.type === 'spreadsheet') {
    return <Spreadsheet content={content} />;
  } else if (content.type === 'variables') {
    return <VariableTable content={content} />;
  }
  return <div>Unknown Content: {content.type}</div>;
}
