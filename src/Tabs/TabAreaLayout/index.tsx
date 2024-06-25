import SingleTabArea from './SingleTabArea';
import TwoHorizontalTabAreas from './TwoHorizontalTabAreas';
import TwoVerticalTabAreas from './TwoVerticalTabAreas';
import QuadrantTabAreas from './QuadrantTabAreas';
import { getTabAreaType, useAppSelector } from 'src/redux/selectors';

export default function TabAreaLayout() {
  const tabAreaType = useAppSelector(getTabAreaType);

  if (tabAreaType === 'single') {
    return <SingleTabArea />;
  } else if (tabAreaType === 'twoHorizontal') {
    return <TwoHorizontalTabAreas />;
  } else if (tabAreaType === 'twoVertical') {
    return <TwoVerticalTabAreas />;
  } else if (tabAreaType === 'quadrant') {
    return <QuadrantTabAreas />;
  }
}
