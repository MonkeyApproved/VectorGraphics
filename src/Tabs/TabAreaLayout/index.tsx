import SingleTabArea from './SingleTabArea';
import TwoHorizontalTabAreas from './TwoHorizontalTabAreas';
import TwoVerticalTabAreas from './TwoVerticalTabAreas';
import QuadrantTabAreas from './QuadrantTabAreas';
import { getTabs, useAppSelector } from 'src/redux/selectors';

export default function TabAreaLayout() {
  const tabs = useAppSelector(getTabs);

  if (tabs.type === 'single') {
    return <SingleTabArea content={tabs.content} />;
  } else if (tabs.type === 'twoHorizontal') {
    return <TwoHorizontalTabAreas content={tabs.content} />;
  } else if (tabs.type === 'twoVertical') {
    return <TwoVerticalTabAreas content={tabs.content} />;
  } else if (tabs.type === 'quadrant') {
    return <QuadrantTabAreas content={tabs.content} />;
  }
}
