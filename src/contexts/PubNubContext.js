import React, { createContext, useContext, useState } from 'react';
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
    const [canvasData, setCanvasData] = useState(null);
    const [messageData, setMessageData] = useState([]);

    const newUUID = PubNub.generateUUID();
    const pubnub = new PubNub({
        publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
        ssl: true,
        uuid: newUUID,
    });

    const updateUserInfo = (username, roomname) => {
        pubnub.setState({
            state: {username: username},
            channels: [roomname]
        }, function (status, response) {
            if (status.isError) {
                console.log(status);
              }
              else {
                console.log(response);
              }
        })
    }

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
                if (event.operation === "PNSubscribeOperation") {
                    console.log('subscribing', event.affectedChannels)
                }
            },
            message(msg) {
                if(msg) {
                    if(msg.message) {
                        if(msg.message.canvas) {
                            setCanvasData(msg.message.canvas);
                        }
                        if(msg.message.chat) {
                            let newMessages = [];
                            newMessages.push({
                                username: msg.message.chat.username,
                                text: msg.message.chat.text,
                                uuid: msg.publisher
                            });
                            setMessageData(messageData => messageData.concat(newMessages));
                        }
                    }
                }
            },
            presence(response) {
                if (response.action === "join") {
                    // console.log(`User ${response.uuid} joined`);
                    pubnub.hereNow({
                        channels: [response.channel]
                    }, function (status, response) {
                        console.log(response.channels[roomname].occupants)
                        // Get occupants? response.channels[channel].occupants
                        // need state in this to connect a username to uuid

                    })
                }
                if (response.action === "leave") {
                    console.log(`User ${response.uuid} left`)
                    // Need to unsubrice to room, doesnt seem to work?
                    unsubscribeFromChannel(response.channel);
                }

                if (response.action === "state-change") {
                    console.log('state change', response)
                }
            },
        });
    };

    const unsubscribeFromChannel = (roomname) => {
        console.log('unsubscribing')
        pubnub.unsubscribe({
            channels: [roomname]
        })
    }

    const publishToChannel = (roomname, data) => {
        const publishConfig = {
            channel: roomname,
            message: data
        };
        pubnub.publish(publishConfig, (status, response) => {
        })
    };

    const getChannelUserData = (roomname) => {
        pubnub.hereNow(
            {
                channels: [roomname], 
                channelGroups : [roomname],
                includeUUIDs: true,
                includeState: true 
            },
            function (status, response) {
                // handle status, response
                // console.log('status: ', status);
                // console.log('response: ', response)
            }
        );
    }

    // Unsubscribing to whiteboard and chat when leaving page

    // Object with context values
    let constextValues = {
        usePubnub, 
        pubnub,
        updateUserInfo,
        subscribeToChannel,
        unsubscribeFromChannel, 
        publishToChannel,
        canvasData,
        messageData,
        getChannelUserData
    }

    return (
        <PubNubContext.Provider value={constextValues}>
            {props.children}
        </PubNubContext.Provider>
    )
}

export { PubNubContext, usePubnub, PubNubContextProvider as default }
