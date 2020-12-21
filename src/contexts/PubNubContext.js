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
    const newUUID = PubNub.generateUUID();
    const pubnub = new PubNub({
        publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
        ssl: true,
        uuid: newUUID,
    });

    const subscribeToChannel = (roomname) => {
        pubnub.subscribe({
            channels: [roomname]
        });

        pubnub.addListener({
            status(event) {
                if (event.category === "PNConnectedCategory") {
                    console.log('connected', event);
                }
            },
            message(msg) {
                console.log(msg.message);
            },
            presence(response) {
                console.log(response);
            }
        });
    };

    const publishToChannel = (roomname, message) => {
        const publishConfig = {
            channel: roomname,
            message
        };
        pubnub.publish(publishConfig, (status, response) => {
            console.log("status", status);
            console.log("response", response);
        })
    }

    return (
        <PubNubContext.Provider value={{ usePubnub, pubnub, subscribeToChannel, publishToChannel }}>
            {props.children}
        </PubNubContext.Provider>
    )
}

export { PubNubContext, usePubnub, PubNubContextProvider as default }
