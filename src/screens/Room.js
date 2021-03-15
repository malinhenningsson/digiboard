import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import Chat from "../components/Chat";

const Room = () => {
  const location = useLocation();
  const { channelId } = useParams();

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
    </>
  );
};

export default Room;
