import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import ChatPopUp from "./ChatPopUp";

const Chat = ({ username, channelName }) => {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div id="chat-wrapper">
      {openChat && (
        <ChatPopUp
          channelName={channelName}
          username={username}
        />
      )}
      <FontAwesomeIcon
        title="toggle chat popup"
        className="fa-icon"
        icon={faComments}
        onClick={() => setOpenChat(!openChat)}
      />
    </div>
  );
};

export default Chat;
