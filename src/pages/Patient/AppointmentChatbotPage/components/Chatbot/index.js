import { useEffect, useMemo, useState } from 'react';
import ReactWebChat, { createDirectLine, createStore } from 'botframework-webchat';
import simpleUpdateIn from 'simple-update-in';
import { getLocalUser } from 'services/UserService'
import { parseBool } from 'utils/parseUtils'
import { getDirectLineToken } from 'services/DirectLineService'

const Chatbot = () => {
    const [directLine, setDirectLine] = useState(null);
    const user = getLocalUser();
    const styleOptions = {
		showAvatarInGroup: false,
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

    useEffect(() => {
        async function fetchDirectLineToken() {
            const response = await getDirectLineToken();
            const token = response.data.data.token;
            const directLineObject = createDirectLine({
                domain:`${process.env.REACT_APP_DIRECTLINE_URL}v3/directline`, 
                token: token, 
                webSocket: parseBool(process.env.REACT_APP_DIRECTLINE_WEB_SOCKET)
            });
            setDirectLine(directLineObject);
        }
        fetchDirectLineToken();
    }, []);
    
    const store = useMemo(() => createStore({}, ({dispatch}) => next => action => {
        if(action.type === 'DIRECT_LINE/POST_ACTIVITY') {
            action = simpleUpdateIn(
                action,
                ['payload', 'activity', 'channelData', 'fullName'],
                () => user.fullName
            );
        }
        return next(action);
    }), [user]);

    return (
        <>
            {
                directLine ? 
                <ReactWebChat 
                className="webchat" 
                directLine={directLine}
                styleOptions={styleOptions}
                store={store}
                /> 
                : 
                <p>Cargando...</p>
            }
        </>
    );
}

export default Chatbot;