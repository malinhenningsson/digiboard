import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrashAlt,
  faPalette,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import OnlineUsers from "./OnlineUsers";

const ToolPicker = ({
  color,
  setColor,
  setClearTheCanvas,
  showInviteUsers,
  setShowInviteUsers,
  handleDownloadCanvas,
}) => {
  const [displayed, setDisplayed] = useState(false);

  const handleClick = () => {
    setDisplayed(true);
  };

  const handleClose = () => {
    setDisplayed(false);
  };

  const handleColor = (color) => {
    setColor(color);
  };

  const handleChange = (pickerColor) => {
    setColor(pickerColor.hex);
    handleColor(pickerColor.hex);
  };

  return (
    <div id="toolpicker-wrapper">
      <div id="tools">
        <FontAwesomeIcon
          title="choose color"
          className="fa-icon"
          icon={faPalette}
          onClick={handleClick}
        />
        {displayed ? (
          <div id="toolpicker-color-popover">
            <div id="toolpicker-color-cover" onClick={handleClose} />
            <ChromePicker color={color} onChange={handleChange} />
          </div>
        ) : null}
        <FontAwesomeIcon
          title="delete"
          className="fa-icon"
          icon={faTrashAlt}
          onClick={() => setClearTheCanvas(true)}
        />
        <FontAwesomeIcon
          title="download"
          className="fa-icon"
          icon={faDownload}
          onClick={() => handleDownloadCanvas()}
        />
      </div>
      <div id="channel-users">
        <FontAwesomeIcon
          title="invite users"
          className="fa-icon"
          icon={faUserPlus}
          onClick={() => setShowInviteUsers(!showInviteUsers)}
        />
        <OnlineUsers />
      </div>
    </div>
  );
};

export default ToolPicker;
