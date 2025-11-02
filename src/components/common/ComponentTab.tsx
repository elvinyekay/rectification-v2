import React from "react";

export interface ComponentTabProps {
    value: string;
    label: string;
    children: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
}

const ComponentTab: React.FC<ComponentTabProps> = () => null;

export default ComponentTab;
