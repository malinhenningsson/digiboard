import React, { createContext, useContext, useEffect, useState } from 'react';
import PubNub from 'pubnub';

const PubNubContext = createContext();

const usePubnub = () => {
	const context = useContext(PubNubContext);
	if (context === undefined) {
		throw new Error('`usePubNub` hook must be used within a `PubNubContextProvider` component');
	}
	return context;
};

const newUUID = `user-${Date.now()}`;
const pubnub = new PubNub({
	publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY,
	subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY,
	ssl: true,
	uuid: newUUID,
	restore: true,
});

const PubNubContextProvider = (props) => {
	const [occupants, setOccupants] = useState(null);
	const [canvasData, setCanvasData] = useState(null);
	const [messageData, setMessageData] = useState([]);
	const [infoMessage, setInfoMessage] = useState("");
	let listener = {};

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

		listener = {
			status(event) {
				if (event.category === "PNConnectedCategory") {
					pubnub.setState({
						channels: [roomname],
						state: {'name': username ? username : "Anonymous"},
					});
				};
				if (event.operation === "PNUnsubscribeOperation") {
					resetState();
				};
				if (event.category === "PNNetworkDownCategory") {
					setInfoMessage("Network is down, please wait or try again later.")
				};
				if (event.category === "PNNetworkUpCategory") {
					setInfoMessage("Network is up and running again.")
				};
				if (event.category === "PNNetworkIssuesCategory") {
					setInfoMessage("There seem to be issues with the network, please wait or try again later.")
				};
			},
			message(msg) {
				if(msg) {
					if(msg.message) {
						if(msg.message.canvas) {
							setCanvasData(msg.message.canvas);
						};
						if(msg.message.chat) {
							let newMessages = [];
							newMessages.push({
								username: msg.message.chat.username,
								text: msg.message.chat.text,
								publisher: msg.publisher,
							});
							setMessageData(messageData => messageData.concat(newMessages));
						};
					};
				};
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
						};
					});

					// Only get history in channel for the user joining
					if (pubnub.getUUID() === response.uuid) {
						getHistory(response.channel);
					};
				};
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
						};
					});
				};
			},
		};
		pubnub.addListener(listener);
	};

	const unsubscribeFromChannel = (roomname) => {
		pubnub.removeListener(listener);
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

	const getHistory = (roomname) => {
		pubnub.fetchMessages(
			{
				channels: [roomname],
				count: 25,
				reverse: true
			},
			function (status, response) {
				if (!status.error) {
					if (!response.channels[roomname]) return; 
					const history = response.channels[roomname];
					const fetchedChat = [];
					history.forEach(obj => {
						if (obj.message.chat) {
							fetchedChat.push(obj.message.chat);
						};
						if (obj.message.canvas) {
							setCanvasData(obj.message.canvas);
						};
					});
					setMessageData(fetchedChat);
				};
			}
		);
	};

	// Unsubscribe user to all channels when closing browser
	useEffect(() => {
		return () => {
			pubnub.unsubscribeAll();
			}
	}, []);

	const constextValues = {
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
};

export { PubNubContext, usePubnub, PubNubContextProvider as default };
