import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <LayoutContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within LayoutProvider');
    }
    return context;
};
