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
    const [occupants, setOccupants] = useState(null);
    const [canvasData, setCanvasData] = useState(null);
    const [messageData, setMessageData] = useState([]);
    const [infoMessage, setInfoMessage] = useState("");

    const newUUID = PubNub.generateUUID();
    const pubnub = new PubNub({
        publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
        ssl: true,
        uuid: newUUID,
    });

    const resetState = () => {
        setOccupants(null);
        setCanvasData(null);
        setMessageData([]);
        setInfoMessage("");
    };

    const updateUserInfo = (username, roomname) => {
        pubnub.setState({
            state: {[pubnub.getUUID()]: username},
            channels: [roomname]
        }, function (status, response) {
            if (status.isError) {
                console.log(status);
              }
              else {
                console.log(response);
              }
        })
    };

    const subscribeToChannel = (roomname) => {
        pubnub.subscribe({
            channels: [roomname],
            withPresence: true,
        });

        pubnub.addListener({
            status(event) {
                console.log('event', event)
                if (event.category === "PNConnectedCategory") {
                    console.log('connected', event);
                }
                if (event.category === "PNReconnectedCategory") {
                    console.log('reconnected', event);
                }
                if (event.category === "PNNetworkDownCategory") {
                    console.log('network down', event);
                }
                if (event.category === "PNNetworkUpCategory") {
                    console.log('network up', event);
                }
                if (event.operation === "PNSubscribeOperation") {
                    console.log('subscribing', event.affectedChannels)
                }
                if (event.operation === "PNUnsubscribeOperation") {
                    console.log('unsubscribing', event);
                    resetState();
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
                setInfoMessage("");
                if (response.action === "join") {
                    // Only show "user joined" message to other users
                    if (pubnub.getUUID() !== response.uuid) {
                        setInfoMessage(`User ${response.uuid} joined`);
                    };

                    pubnub.hereNow({
                        channels: [response.channel]
                    }, function (status, response) {
                        if (response.channels[roomname]) {
                            setOccupants(response.channels[roomname]);
                        }
                    });
                }
                if (response.action === "leave") {
                    // Only show "user left" message to other users
                    if (pubnub.getUUID() !== response.uuid) {
                        setInfoMessage(`User ${response.uuid} left`);
                    };
                    
                    pubnub.hereNow({
                        channels: [response.channel]
                    }, function (status, response) {
                        if (response.channels[roomname]) {
                            setOccupants(response.channels[roomname]);
                        }
                    });
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
        });
        resetState();
    };

    const publishToChannel = (roomname, data) => {
        const publishConfig = {
            channel: roomname,
            message: data,
        };
        pubnub.publish(publishConfig, (status, response) => {
            setInfoMessage("");
            if (status.error) {
                setInfoMessage("Sorry, could not send your message to the other users.")
            };
        })
    };

    // Unsubscribe user to all channels when closing browser
    useEffect(() => {
        return () => {
                pubnub.unsubscribeAll();
            }
    }, []);

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
        occupants,
        infoMessage,
    }

    return (
        <PubNubContext.Provider value={constextValues}>
            {props.children}
        </PubNubContext.Provider>
    )
}

export { PubNubContext, usePubnub, PubNubContextProvider as default }
