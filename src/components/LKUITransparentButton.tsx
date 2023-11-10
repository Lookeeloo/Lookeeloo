import React from 'react';

interface LKUITransparentButtonProps {
  regComponent: React.ComponentType;
  ref?: React.RefObject<HTMLDivElement>;
  className?: string;
  onClick?: (() => void) | undefined;
}

function LKUITransparentButton({ regComponent, ref, onClick, className }: LKUITransparentButtonProps) {
  const Icon = regComponent;

  return (
    <div className={`lkui-transparent-button ${className || ''}`} ref={ref} onClick={onClick}>
      <Icon />
    </div>
  );
}

export default LKUITransparentButton;
