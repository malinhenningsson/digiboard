import React, { useState, useEffect } from "react";
import { usePubnub } from "../contexts/PubNubContext";
import UsersDropDown from "./UsersDropDown";

const OnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [openUserList, setOpenUserList] = useState(false);
    const { occupants } = usePubnub();

    useEffect(() => {
        console.log('occupants', occupants)
        if (occupants && occupants.occupants.length !== 0) {
        const users = occupants.occupants.map(occupant => {
            if (occupant.state !== null) {
                return {
                    name: occupant.state.name,
                    id: occupant.uuid
                };
            }
        })
        setOnlineUsers(users);
        }
    }, [occupants])

    return (
        <div id="online-users-wrapper">
            <p id="online-users-counter" onClick={() => setOpenUserList(!openUserList)}>
                Online: {occupants ? occupants.occupancy : "0"} 
                <span id="open-user-list">▼</span>
            </p>
            {
                openUserList && (
                    <UsersDropDown onlineUsers={onlineUsers} />
                ) 
            }
        </div>
    );
};

export default OnlineUsers;