import Spreadsheet from 'components/equationInputs/Spreadsheet';
import './App.css';
import VariableTable from './components/equationInputs/VariableTable';
import MainTabs, { TabDict } from './components/mainPage/MainTabs';
import SvgEditor from './components/svgEditor/SvgEditor';

function App() {
  const tabDict: TabDict = {
    Variables: <VariableTable />,
    Spreadsheet: <Spreadsheet initialRows={5} initialColumns={5} />,
    'SVG Editor': <SvgEditor />,
  };

  return <MainTabs tabDict={tabDict} />;
}

export default App;
