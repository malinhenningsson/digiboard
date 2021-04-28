import React from "react";

const UsersDropDown = ({ onlineUsers }) => {

    return (
        <div id="online-users-dropwdown">
            <ul>
                {
                    onlineUsers && onlineUsers.length > 0 && onlineUsers.map((user, index) => {
                    return (
                        <li key={index}> <span className="online-mark">●</span> <span className="user-name">{user}</span></li>
                    )
                    })
                }
            </ul>
        </div>
    );
};

export default UsersDropDown;