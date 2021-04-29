import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { init, send } from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const InviteUsers = ({ username, showInviteUsers, setShowInviteUsers }) => {
  const [email, setEmail] = useState("");
  const [invitationSent, setInvitationSent] = useState(false);
  const { channelId } = useParams();
  const url = `${window.location.origin}/invite/${channelId}`;

  // Initialize email functionality
  init(process.env.REACT_APP_EMAILJS_USERID);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      email: email,
      from_name: username,
      message: `Please go to ${url} to join the Digiboard.`,
    };

    send("default_service", "template_dmf1l6e", templateParams)
      .then((res) => {
        setInvitationSent(true);
      })
      .catch((err) => console.log(err));
  };

  const closeInviteBox = () => {
    setShowInviteUsers(!showInviteUsers);
    setEmail("");
  };

  const resetInviteBox = () => {
    setInvitationSent(!invitationSent);
    setEmail("");
  };

  return (
    <div id="invite-users-wrapper" onClick={() => closeInviteBox()}>
      <div id="invite-users-content" onClick={(e) => e.stopPropagation()}>
        <div className="fa-icon-box">
          <FontAwesomeIcon
            title="close invitation box"
            className="fa-icon"
            icon={faTimes}
            onClick={() => closeInviteBox()}
          />
        </div>
        {invitationSent ? (
          <>
            <div className="email-sent">
              <p>
                Invitation has been sent to <span>{email}</span>.
              </p>
              <p>
                Send another invitation?{" "}
                <span className="add-user" onClick={() => resetInviteBox()}>
                  Add user
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1>Intive others to join you digiboard</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                type="email"
                placeholder="Enter an email to invite user"
                value={email}
                onChange={(e) => handleChange(e)}
              />
              <button>Send invite</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteUsers;
