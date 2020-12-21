import React, { createContext, useContext, useEffect, useState } from 'react';
import PubNub from 'pubnub';

const PubNubContext = createContext();

const usePubnub = () => {
    return useContext(PubNubContext);
}

const PubNubContextProvider = (props) => {
    const [pubnubUser, setPubnubUser] = useState(null);

    useEffect(() => {
        let pubnub = new PubNub({
            publish_key: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
            subscribe_key: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
            ssl: true
        });

        setPubnubUser(pubnub);
    }, [])

    const contextValues = { pubnubUser };

    return (
        <PubNubContext.Provider value={contextValues}>
            {props.children}
        </PubNubContext.Provider>
    )
}

export { PubNubContext, usePubnub, PubNubContextProvider as default }
