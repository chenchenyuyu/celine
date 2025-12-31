import React from 'react';
import './style.scss';

interface IButton {
    size: 'large' | 'middle' | 'small',
    type?: string,
    disable?: boolean,
    children: React.ReactNode,
    onClick?: () => void,
    style?: React.CSSProperties,
}

const Button = ({ size, type, disable, style, onClick, children }: IButton) => {
  return(
    <div 
        className={`cs-btn ${disable ? 'cs-btn-disable' : ''} ${size ? `cs-btn-${size}`: ''}`}
        onClick={disable ? undefined: onClick }
        style={style}
        >
     {children}
    </div>
  )
}

export default Button;