import MenuButton from 'src/generalComponents/MenuButton';
import styles from './styles.module.css';
import { MainMenuItem, SubMenuItem } from './menuStructure';
import { MainUserActionTypes } from 'src/redux/types';

interface MainMenuButtonProps {
  menuItem: MainMenuItem;
  selected: boolean;
  onClick: (item: MainUserActionTypes) => void;
}

export function MainMenuButton({ menuItem, selected, onClick }: MainMenuButtonProps) {
  const className = selected ? styles.subMenuButtonSelected : styles.subMenuButton;
  return <MenuButton text={menuItem.text} className={className} onClick={() => onClick(menuItem.data)} />;
}

interface SubMenuButtonProps {
  menuItem: SubMenuItem;
  selected: boolean;
  onClick: (item: SubMenuItem) => void;
}

export function SubMenuButton({ menuItem, selected, onClick }: SubMenuButtonProps) {
  const className = selected ? styles.subMenuButtonSelected : styles.subMenuButton;
  return <MenuButton text={menuItem.text} className={className} onClick={() => onClick(menuItem)} />;
}
