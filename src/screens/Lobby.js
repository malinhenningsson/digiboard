import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePubnub } from "../contexts/PubNubContext";

const Lobby = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const { subscribeToChannel, updateUserInfo } = usePubnub();

  const getRandomRoomName = () => {
    return Math.random().toString(20).substr(2, 10);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomname = getRandomRoomName();
    updateUserInfo(username, roomname);
    subscribeToChannel(roomname, username);
    navigate(`/channel/${roomname}`, { state: { username } });
  };

  return (
    <div id="lobby-wrapper">
      <h1>DigiBoard</h1>
      <form id="lobby-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Choose a username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button>Create room</button>
      </form>
    </div>
  );
};

export default Lobby;
