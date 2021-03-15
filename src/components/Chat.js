import React, { useEffect, useState } from "react";
import { usePubnub } from "../contexts/PubNubContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import ChatPopUp from "./ChatPopUp";

const Chat = ({ username, channelName }) => {
  const [ownUsername, setOwnUsername] = useState("Anonymous");
  const [openChat, setOpenChat] = useState(false);
  const { getChannelUserData } = usePubnub();

  useEffect(() => {
    setOwnUsername(username);
    getChannelUserData(channelName);
  }, []);

  return (
    <div id="chat-wrapper">
      {openChat && (
        <ChatPopUp
          channelName={channelName}
          ownUsername={ownUsername}
          username={username}
        />
      )}
      <FontAwesomeIcon
        title="open or close chat"
        className="fa-icon"
        icon={faComments}
        onClick={() => setOpenChat(!openChat)}
      />
    </div>
  );
};

export default Chat;
