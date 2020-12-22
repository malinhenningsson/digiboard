import React, { createContext, useContext, useEffect, useState } from 'react';
import PubNub from 'pubnub';

const PubNubContext = createContext();

const usePubnub = () => {
    const context = useContext(PubNubContext);
    if (context === undefined) {
        throw new Error('`usePubNub` hook must be used within a `PubNubContextProvider` component');
    }
    return context;
}

const PubNubContextProvider = (props) => {
    const [recievedData, setRecievedData] = useState(null);

    const newUUID = PubNub.generateUUID();
    const pubnub = new PubNub({
        publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
        ssl: true,
        uuid: newUUID,
    });

    const subscribeToChannel = (roomname) => {
        pubnub.subscribe({
            channels: [roomname],
            withPresence: true,
        });

        pubnub.addListener({
            status(event) {
                if (event.category === "PNConnectedCategory") {
                    console.log('connected', event);
                }
            },
            message(msg) {
                if(msg) {
                    if(msg.message) {
                        setRecievedData(msg.message);
                    }
                }
            },
            presence(response) {
                console.log(response);
            }
        });
    };

    const publishToChannel = (roomname, data) => {
        const publishConfig = {
            channel: roomname,
            message: data
        };
        pubnub.publish(publishConfig, (status, response) => {
            console.log("status", status);
            console.log("response", response);
        })
    }

    // Function for connecting to chat

    // Unsubscribing to whiteboard and chat when leaving page

    // Object with context values
    let constextValues = {
        usePubnub, 
        pubnub, 
        subscribeToChannel, 
        publishToChannel,
        recievedData
    }

    return (
        <PubNubContext.Provider value={constextValues}>
            {props.children}
        </PubNubContext.Provider>
    )
}

export { PubNubContext, usePubnub, PubNubContextProvider as default }
