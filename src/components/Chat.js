import React, { useState, useRef } from 'react'

const Chat = (user, onlineUsers) => {
    const [username, setUsername] = useState('Anonymous');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        let list = messageList;
        list.push(message);

        setMessageList(list);
        setMessage('');
        inputRef.current.value = "";
    }

    return (
        <div id="chat-wrapper">
            <div className="online-users">
                <h1 className="bold">Online:</h1>
                <ul>
                    <li>User 1</li>
                    <li>User 2</li>
                </ul>
            </div>
            <div>
                <ul>
                    {/* <li className="your-msg"><span className="bold">{username}:</span> Hello!</li>
                    <li className="others-msg"><span className="bold">{username}:</span> Hey!</li>
                    <li className="others-msg"><span className="bold">{username}:</span> Whats up?</li> */}
                    {
                        messageList.map((message, index) => (
                            <li key={index} className="your-msg"><span className="bold">{username}:</span> {message}</li>
                        ))
                    }
                </ul>
                <form onSubmit={handleSubmit}>
                    <input 
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
