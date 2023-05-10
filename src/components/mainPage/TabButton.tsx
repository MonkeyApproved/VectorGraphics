import { useAppSelector } from 'redux/hooks';
import cn from 'classnames';
import { getContentLabel, getContentType } from 'redux/dataStore/userInterface/selectors';
import ContentIcon from './ContentIcon';
import styles from './styles.module.css';
import { MainContentTypes } from 'redux/dataStore/userInterface/content';

export function getContentBgColorClass(contentType: MainContentTypes) {
  if (contentType === 'variables') return styles.variablesBgColor;
  if (contentType === 'spreadsheet') return styles.spreadsheetBgColor;
  if (contentType === 'canvas') return styles.canvasBgColor;
  return styles.canvasBgColor;
}

export interface TabButtonProps {
  contentId: string;
  selected: boolean;
  onClick: (newId: string) => void;
}

export default function TabButton({ contentId, selected, onClick }: TabButtonProps) {
  const contentType = useAppSelector(getContentType(contentId));
  const contentLabel = useAppSelector(getContentLabel(contentId));

  return (
    <div
      className={cn(styles.tabLabelWrapper, getContentBgColorClass(contentType), { [styles.unselected]: !selected })}
      onClick={() => onClick(contentId)}
    >
      <ContentIcon contentType={contentType} />
      <span>
        {contentLabel}
        {selected ? '*' : ''}
      </span>
    </div>
  );
}
