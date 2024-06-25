import Canvas from 'src/Canvas';
import VariableManager from 'src/VariableManager';
import { CANVAS_CONTENT_TYPE, Content, VARIABLE_MANAGER_CONTENT_TYPE } from 'src/redux/content';

export default function TabAreaContent({ selectedTab }: { selectedTab: Content | undefined }) {
  if (!selectedTab) {
    return <div></div>;
  } else if (selectedTab.type === CANVAS_CONTENT_TYPE) {
    return <Canvas canvasId={selectedTab.contentId} />;
  } else if (selectedTab.type === VARIABLE_MANAGER_CONTENT_TYPE) {
    return <VariableManager managerId={selectedTab.contentId} />;
  }
  return <div>{selectedTab.type}</div>;
}
