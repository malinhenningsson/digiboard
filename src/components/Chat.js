import React, { useEffect, useState, useRef } from 'react';
import { usePubnub } from '../contexts/PubNubContext';

const Chat = ({ username, channelName }) => {
    const [ownUsername, setOwnUsername] = useState('Anonymous');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const inputRef = useRef(null);
    const { publishToChannel, messageData, getChannelUserData } = usePubnub();

    useEffect(() => {
        setOwnUsername(username);
        getChannelUserData(channelName);
    }, [])

    useEffect(() => {
        console.log('message data: ', messageData);
        setMessageList(messageData);
    }, [messageData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        publishToChannel(channelName, {
            chat: {
                username: username,
                text: message
            }
        })
        setMessage('');
        inputRef.current.value = "";
        
        // Need to fix better solution to scroll into view, not optimal.
        document.querySelector("#chat-input").scrollIntoView();
    }

    return (
        <div id="chat-wrapper">
            <div className="online-users">
                <h1 className="bold">Online:</h1>
                <ul>
                    <li>{username}</li>
                </ul>
            </div>
            <div id="chat-msg-box">
                <ul>
                    {
                        messageList.map((message, index) => (
                            <li key={index} className={message.username === ownUsername ? "your-msg" : "others-msg"}><span className="bold">{message.username}:</span> {message.text}</li>
                        ))
                    }
                </ul>
                <form onSubmit={handleSubmit}>
                    <input 
                        id="chat-input"
                        type="text" 
                        placeholder="Chat with the other users"
                        ref={inputRef} 
                        onChange={(e) => setMessage(e.target.value)} 
                        />
                </form>
            </div>
        </div>
    )
}

export default Chat
