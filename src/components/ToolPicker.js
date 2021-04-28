import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrashAlt,
  faPalette,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { usePubnub } from "../contexts/PubNubContext";

const ToolPicker = ({
  color,
  setColor,
  setClearTheCanvas,
  showInviteUsers,
  setShowInviteUsers,
  handleDownloadCanvas,
}) => {
  const popover = {
    position: "absolute",
    zIndex: "2",
    marginLeft: "8px",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };
  const [displayed, setDisplayed] = useState(false);
  const { occupants } = usePubnub();

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
          <div style={popover}>
            <div style={cover} onClick={handleClose} />
            <ChromePicker color={color} onChange={handleChange} />
          </div>
        ) : null}
        <FontAwesomeIcon
          title="choose color"
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
        <p>Occupancy: {occupants ? occupants.occupancy : "0"}</p>
      </div>
    </div>
  );
};

export default ToolPicker;
