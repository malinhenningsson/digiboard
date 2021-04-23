import React, { useState, useEffect, useRef } from "react";
import { usePubnub } from "../contexts/PubNubContext";

const ChatPopUp = ({ channelName, ownUsername, username }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const inputRef = useRef(null);
  const { publishToChannel, messageData } = usePubnub();

  useEffect(() => {
    console.log("message data: ", messageData);
    setMessageList(messageData);
  }, [messageData]);

  const handleSubmit = (e) => {
    console.log(message);
    e.preventDefault();

    publishToChannel(channelName, {
      chat: {
        username: username,
        text: message,
      },
    });
    setMessage("");
    inputRef.current.value = "";

    // Need to fix better solution to scroll into view, not optimal.
    document.querySelector("#chat-input").scrollIntoView();
  };

  return (
    <div id="chat-msg-box">
      <div id="chat-msg-box-content">
        <ul>
          {messageList.map((message, index) => (
            <li
              key={index}
              className={
                message.username === ownUsername ? "your-msg" : "others-msg"
              }
            >
              <span className="bold">
                {message.username === ownUsername ? "You" : message.username}:
                </span>
                {message.text}
            </li>
          ))}
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
  );
};

export default ChatPopUp;
