import { ReactNode } from 'react';
import styles from './styles.module.css';

interface MenuButtonProps {
  text?: string;
  icon?: ReactNode;
  onClick: () => void;
}

export default function MenuButton({ text, icon, onClick }: MenuButtonProps) {
  return (
    <button className={styles.shapeButtons} onClick={onClick}>
      {text && <span className="noSelect">{text}</span>}
      {icon && <div className="noSelect">{icon}</div>}
    </button>
  );
}
