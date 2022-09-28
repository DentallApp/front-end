import { useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import SideBarContext from './SideBarContext';

const SideBarProvider = ({ children }) => {

    const [display, setDisplay] = useState(false);
    const onlyWidth = useWindowWidth();

    const handleSidebar = (state) => setDisplay(state);

    return (
        <SideBarContext.Provider
            value={{
                onlyWidth,
                display,
                handleSidebar
            }}
        >
            {children}
        </SideBarContext.Provider>
    );
}

export default SideBarProvider;