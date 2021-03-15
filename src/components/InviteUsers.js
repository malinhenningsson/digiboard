import React, { useState } from "react";
import { init, send } from "emailjs-com";

const InviteUsers = ({ username }) => {
  const [email, setEmail] = useState("");
  const [invitationSent, setInvitationSent] = useState(false);
  const url = window.location.href;

  console.log(url);

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

  return (
    <div id="invite-users-wrapper">
      <div id="invite-users-content">
        <h1>Intive others to join you digiboard</h1>
        {invitationSent ? (
          <>
            <p>Invitation has been sent to {email}.</p>
          </>
        ) : (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="email"
              placeholder="Enter an email to invite user"
              value={email}
              onChange={(e) => handleChange(e)}
            />
            <button>Send invite</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteUsers;
