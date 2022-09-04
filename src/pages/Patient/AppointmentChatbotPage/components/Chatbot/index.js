import { useEffect, useMemo, useState } from 'react';
import ReactWebChat, { createDirectLine, createStore } from 'botframework-webchat';
import simpleUpdateIn from 'simple-update-in';
import { getLocalUser } from 'services/UserService'

const Chatbot = () => {

    let directline = null;
    const [token, setToken] = useState(null);
    const user = getLocalUser();
    
    const styleOptions = {
        botAvatarImage:
            'https://docs.microsoft.com/en-us/azure/bot-service/v4sdk/media/logo_bot.svg?view=azure-bot-service-4.0',
        botAvatarInitials: 'BF',
        userAvatarImage: 'https://github.com/compulim.png?size=64',
        userAvatarInitials: 'WC',
        scrollToEndBehavior: false,
        showSpokenText: true,
        hideUploadButton: true
    };

    const getToken = async () => {

        let userId ="User-"+ parseInt(Math.random()* 1000000);
    
        const res = await fetch('http://localhost:5000/v3/directline/tokens/generate', 
        { 
          method: 'POST', 
          headers:{
            "Content-Type":"application/json",
          },
          body: JSON.stringify({ userId: userId, password: ""}) 
        });
        const { token } = await res.json();
        
        return token;
    }

    useEffect(() => {
        async function fetchMyAPI() {
          const response = await getToken();
          setToken(response);
        }
        fetchMyAPI();
            
    }, []);

    directline = useMemo(() => createDirectLine({domain:'http://localhost:5000/v3/directline',token: token}), [token]);

    const store = useMemo(() => createStore({}, () => next => action => {
        if(action.type === 'DIRECT_LINE/POST_ACTIVITY') {
            action = simpleUpdateIn(
                action,
                ['payload', 'activity', 'channelData', 'personId'],
                () => user.userId
            );

            action = simpleUpdateIn(
                action,
                ['payload', 'activity', 'channelData', 'fullName'],
                () => user.names + ' ' + user.lastNames
            );

            /*action = simpleUpdateIn(
                action,
                ['payload', 'activity', 'channelData', 'accessToken'],
                () => user.accessToken
            );*/
        }
        return next(action);
    }), [user]);

    return (
        <>
            {
                directline ? 
                <ReactWebChat 
                className="webchat" 
                directLine={directline} 
                userID={user.userId.toString()} 
                userName={user.userName}
                styleOptions={styleOptions}
                store={store} /> 
                : 
                <p>Cargando</p>
            }
        </>
    );
}

export default Chatbot;