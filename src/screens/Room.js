import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import Chat from "../components/Chat";
import InviteUsers from "../components/InviteUsers";

const Room = () => {
  const [showInviteUsers, setShowInviteUsers] = useState(false);
  const location = useLocation();
  const { channelId } = useParams();

  useEffect(() => {
    setShowInviteUsers(true);
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
        />
      )}
    </>
  );
};

export default Room;
