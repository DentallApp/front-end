import { useEffect, useMemo, useState } from 'react';
import ReactWebChat, { createDirectLine, createStore } from 'botframework-webchat';
import simpleUpdateIn from 'simple-update-in';
import { getLocalUser } from 'services/UserService'
import { parseBool } from 'utils/parseUtils'

const Chatbot = () => {

    let directline = null;
    const [token, setToken] = useState(null);
    const user = getLocalUser();
    
    const styleOptions = {
        botAvatarImage: require('img/bot.png'),
        botAvatarInitials: 'BF',
        userAvatarImage: require('img/user.png'),
        userAvatarInitials: 'WC',
        scrollToEndBehavior: false,
        showSpokenText: true,
        hideUploadButton: true,
        bubbleBackground: '#12CAD6',
        bubbleFromUserBackground: '#003865',
        bubbleBorderRadius: 10,
        bubbleFromUserBorderRadius: 10,
        bubbleFromUserTextColor: 'White',
        rootWidth: '100%',
        sendBoxBorderBottom: '1px solid #9FC9F3',
        sendBoxBorderLeft: '1px solid #9FC9F3',
        sendBoxBorderRight: '1px solid #9FC9F3',
        sendBoxBorderTop: '1px solid #9FC9F3'
    };

    const getToken = async () => {

        let userId ="User-"+ parseInt(Math.random()* 1000000);
    
        const res = await fetch(`${process.env.REACT_APP_DIRECTLINE_URL}v3/directline/tokens/generate`, 
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

    directline = useMemo(() => createDirectLine({
						domain:`${process.env.REACT_APP_DIRECTLINE_URL}v3/directline`, 
						token: token, 
						webSocket: parseBool(process.env.REACT_APP_DIRECTLINE_WEB_SOCKET)
					}), [token]);

    const store = useMemo(() => createStore({}, ({dispatch}) => next => action => {
        if(action.type === 'DIRECT_LINE/POST_ACTIVITY') {
            action = simpleUpdateIn(
                action,
                ['payload', 'activity', 'channelData', 'personId'],
                () => user.personId
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
                store={store}
                /> 
                : 
                <p>Cargando</p>
            }
        </>
    );
}

export default Chatbot;