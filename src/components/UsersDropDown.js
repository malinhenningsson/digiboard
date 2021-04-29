import React from "react";
import { usePubnub } from "../contexts/PubNubContext";

const UsersDropDown = ({ onlineUsers }) => {
    const { pubnub } = usePubnub()

    return (
        <>
            {
                onlineUsers && onlineUsers.length > 0 && (
                    <div id="online-users-dropwdown">
                        <ul>
                            {
                                onlineUsers.map((user, index) => {
                                    return (
                                        <li key={index}>
                                            <span className="user-name">
                                                {user.id === pubnub.getUUID() 
                                                    ? "You" 
                                                    : user.name
                                                }
                                            </span>
                                            <span className="online-mark"> ●</span> 
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                )
            }
        </>
    );
};

export default UsersDropDown;