import React from 'react'
import { useLocation } from 'react-router-dom';

interface LKUINavButtonProps {
    path: string;
    regComponent: React.ComponentType;
    filledComponent: React.ComponentType
}
function LKUINavButton({ path, regComponent, filledComponent }: LKUINavButtonProps) {
    const loc = useLocation()
    const isDesignatedPage = loc.pathname === path
    const IconPath = isDesignatedPage ? filledComponent : regComponent
}
export default LKUINavButton