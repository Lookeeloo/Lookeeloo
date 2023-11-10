import React from 'react'
interface LKUITransparentButtonProps {
    regComponent: React.ComponentType;
    ref?: React.RefObject<HTMLDivElement>;
    onClick?: () => void
}
function LKUITransparentButton({ regComponent, ref, onClick }: LKUITransparentButtonProps) {
    const Icon = regComponent;
    return (
        <div className='lkui-transparent-button' ref={ref} onClick={onClick}>
            <Icon />
        </div>
    )
}
export default LKUITransparentButton