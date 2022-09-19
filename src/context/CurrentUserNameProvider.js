import { useState, useEffect } from 'react';
import { getLocalUser } from 'services/UserService';
import CurrentUserNameContext from './CurrentUserNameContext';

const CurrentUserNameProvider = ({ children }) => {

    const [name, setName] = useState('');

    useEffect(() => {
        setName(`${getLocalUser().names?.split(' ')[0] ?? ''} ${getLocalUser().lastNames?.split(' ')[0] ?? ''}`)
    }, []);

    const handleNames = () => setName(`${getLocalUser().names?.split(' ')[0] ?? ''} ${getLocalUser().lastNames?.split(' ')[0] ?? ''}`);

    const clearNames = () => setName('');

    return (
        <CurrentUserNameContext.Provider
            value={{
                name,
                handleNames,
                clearNames
            }}
        >
            {children}
        </CurrentUserNameContext.Provider>
    );
}

export default CurrentUserNameProvider;