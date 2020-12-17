import React from 'react'

const Chat = () => {
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
                    <li className="your-msg"><span className="bold">User 1:</span> Hello!</li>
                    <li className="others-msg"><span className="bold">User 2:</span> Hey!</li>
                    <li className="others-msg"><span className="bold">User 2:</span> Whats up?</li>
                </ul>
                <input type="text" placeholder="Chat with the other users" />
            </div>
        </div>
    )
}

export default Chat
