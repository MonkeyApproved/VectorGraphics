import { CSSProperties, ReactNode } from 'react';

interface MenuButtonProps {
  text?: string;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function MenuButton(props: MenuButtonProps) {
  return (
    <button className={props.className} style={props.style} onClick={props.onClick}>
      {props.text && <span className="noSelect">{props.text}</span>}
      {props.icon && <div className="noSelect">{props.icon}</div>}
    </button>
  );
}
