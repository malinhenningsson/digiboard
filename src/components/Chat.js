import React, { useEffect, useState, useRef } from 'react'

const Chat = ({ username }) => {
    const [ownUsername, setOwnUsername] = useState('Anonymous');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        setOwnUsername(username);
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        let list = messageList;
        list.push(message);

        setMessageList(list);
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
                    <li>{ownUsername} (You)</li>
                </ul>
            </div>
            <div id="chat-msg-box">
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
