import React, { useState, useEffect, useRef } from "react";
import { usePubnub } from "../contexts/PubNubContext";

const ChatPopUp = ({ channelName, username }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const inputRef = useRef(null);
  const { publishToChannel, messageData, pubnub } = usePubnub();

  useEffect(() => {
    setMessageList(messageData);

    // Scroll last received message into view
    document.querySelector("#chat-msg-ul").addEventListener("DOMNodeInserted", event => {
      const { currentTarget: target } = event;
      target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
    });
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
  };

  return (
    <div id="chat-msg-box">
      <div id="chat-msg-box-content">
        <ul id="chat-msg-ul">
          {messageList.map((message, index) => (
            <li
              key={index}
              className={
                message.publisher === pubnub.getUUID() ? "your-msg" : "others-msg"
              }
            >
              <span className="bold">
                {message.publisher === pubnub.getUUID() ? "You" : message.username}:{" "}
                </span>
                 {message.text}
            </li>
          ))}
        </ul>
        <div id="chat-input-wrapper">
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
    </div>
  );
};

export default ChatPopUp;
