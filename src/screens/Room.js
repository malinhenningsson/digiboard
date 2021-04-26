import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import Chat from "../components/Chat";
import InviteUsers from "../components/InviteUsers";
import { usePubnub } from "../contexts/PubNubContext";
import PopUp from "../components/PopUp";

const Room = () => {
  const [showInviteUsers, setShowInviteUsers] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const location = useLocation();
  const { channelId } = useParams();
  const { unsubscribeFromChannel, infoMessage } = usePubnub();

  useEffect(() => {
    if (infoMessage) {
      setShowInfoMessage(true);
      setTimeout(
        () => setShowInfoMessage(false), 
        4000
      );
    } else {
      setShowInfoMessage(false);
    }
  }, [infoMessage]);

  // Unsubscribe from channel when leaving the room
  useEffect(() => {
    return () => {
      unsubscribeFromChannel(channelId);
    }
  }, []);

  return (
    <>
      <div>
        <Whiteboard
          username={
            location.state && location.state.username
              ? location.state.username
              : "Anonymous"
          }
          channelName={channelId}
          showInviteUsers={showInviteUsers}
          setShowInviteUsers={setShowInviteUsers}
        />
      </div>
      <div>
        <Chat
          username={
            location.state && location.state.username
              ? location.state.username
              : "Anonymous"
          }
          channelName={channelId}
        />
      </div>
      {showInviteUsers && (
        <InviteUsers
          username={
            location.state && location.state.username
              ? location.state.username
              : "Anonymous"
          }
          showInviteUsers={showInviteUsers}
          setShowInviteUsers={setShowInviteUsers}
        />
      )}
      {showInfoMessage &&
        <PopUp message={infoMessage} />
      }
    </>
  );
};

export default Room;
