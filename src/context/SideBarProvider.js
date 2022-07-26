import { useState, useEffect} from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import SideBarContext from './SideBarContext';

const SideBarProvider = ({ children }) => {

    const [display, setDisplay] = useState(false);
    const onlyWidth = useWindowWidth();

    useEffect(() => {
        if(onlyWidth <= 768) setDisplay(false);
        else setDisplay(true);
    }, [onlyWidth]);

    const handleSidebar = () => setDisplay(!display);

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