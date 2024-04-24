import React from 'react';

interface LKUITransparentButtonProps {
  children: React.ReactNode;
  fluentIcon?: React.ReactNode;
  onClick?: (() => void) | undefined;
}

function LKUIControlTextableButton({ children, onClick, fluentIcon }: LKUITransparentButtonProps) {
  return (
    <div className='lkui-controls-textable-button' onClick={onClick}>
        {fluentIcon} <span>{children}</span>
    </div>
  );
}

export default LKUIControlTextableButton;
