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
const newUUID = `user-${Date.now()}`;
const pubnub = new PubNub({
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    ssl: true,
    uuid: newUUID,
});

const PubNubContextProvider = (props) => {
    const [occupants, setOccupants] = useState(null);
    const [canvasData, setCanvasData] = useState(null);
    const [messageData, setMessageData] = useState([]);
    const [infoMessage, setInfoMessage] = useState("");

    const resetState = () => {
        setOccupants(null);
        setCanvasData(null);
        setMessageData([]);
        setInfoMessage("");
    };

    const getUserState = async (id, roomname) => {
        const res = await pubnub.getState({ uuid: id, channels: [roomname]});
        return res.channels[roomname].name;
    };

    const subscribeToChannel = (roomname, username) => {
        pubnub.subscribe({
            channels: [roomname],
            withPresence: true,
        });

        pubnub.addListener({
            status(event) {
                console.log('event', event)
                if (event.category === "PNConnectedCategory") {
                    console.log('connected', event);
                    pubnub.setState({
                        channels: [roomname],
                        state: {'name': username ? username : "Anonymous"},
                        callback : function(m){console.log(m)},
                        error : function(m){console.log(m)}
                    });
                }
                if (event.category === "PNReconnectedCategory") {
                    console.log('reconnected', event);
                }
                if (event.operation === "PNSubscribeOperation") {
                    console.log('subscribing', event.affectedChannels)
                }
                if (event.operation === "PNUnsubscribeOperation") {
                    console.log('unsubscribing', event);
                    resetState();
                }
                if (event.category === "PNNetworkDownCategory") {
                    setInfoMessage("Network is down, please wait or try again later.")
                }
                if (event.category === "PNNetworkUpCategory") {
                    setInfoMessage("Network is up and running again.")
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
                                publisher: msg.publisher,
                            });
                            setMessageData(messageData => messageData.concat(newMessages));
                        }
                    }
                }
            },
            async presence(response) {
                setInfoMessage("");
                if (response.action === "join") {
                    // Only show "user joined" message to other users
                    if (pubnub.getUUID() !== response.uuid) {
                        setInfoMessage(`${await getUserState(response.uuid, roomname)} joined the room`);
                    };

                    pubnub.hereNow({
                        channels: [response.channel],
                        includeUUIDs: true,
                        includeState: true,
                    }, function (status, response) {
                        if (response.channels[roomname]) {
                            setOccupants(response.channels[roomname]);
                        }
                    });
                }
                if (response.action === "leave") {
                    // Only show "user left" message to other users
                    if (pubnub.getUUID() !== response.uuid) {
                        setInfoMessage(`${await getUserState(response.uuid, roomname)} left the room`);
                    };

                    pubnub.hereNow({
                        channels: [response.channel],
                        includeUUIDs: true,
                        includeState: true,
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
        console.log('Mounting app, setting up pubnub')
        return () => {
            console.log('Unmounting app, shutting down pubnub')
            pubnub.unsubscribeAll();
            }
    }, []);

    // Object with context values
    let constextValues = {
        pubnub,
        usePubnub,
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
