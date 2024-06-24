import SingleTabArea from './SingleTabArea';
import TwoHorizontalTabAreas from './TwoHorizontalTabAreas';
import TwoVerticalTabAreas from './TwoVerticalTabAreas';
import QuadrantTabAreas from './QuadrantTabAreas';
import { TabAreaType } from 'src/redux/types';

export default function TabAreaLayout({ tabAreaType }: { tabAreaType: TabAreaType }) {
  if (tabAreaType === 'single') {
    return <SingleTabArea />;
  } else if (tabAreaType === 'two-horizontal') {
    return <TwoHorizontalTabAreas />;
  } else if (tabAreaType === 'two-vertical') {
    return <TwoVerticalTabAreas />;
  } else if (tabAreaType === 'quadrant') {
    return <QuadrantTabAreas />;
  }
}
