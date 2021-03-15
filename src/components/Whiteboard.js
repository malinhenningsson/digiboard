import React, { useRef, useState } from "react";
import Canvas from "./Canvas";
import ToolPicker from "./ToolPicker";

const Whiteboard = ({ channelName, showInviteUsers, setShowInviteUsers }) => {
  const parentRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [clearTheCanvas, setClearTheCanvas] = useState(false);

  return (
    <div id="whiteboard-wrapper" ref={parentRef}>
      <ToolPicker
        color={color}
        setColor={setColor}
        channelName={channelName}
        setClearTheCanvas={setClearTheCanvas}
        showInviteUsers={showInviteUsers}
        setShowInviteUsers={setShowInviteUsers}
      />
      <Canvas
        parentRef={parentRef}
        color={color}
        channelName={channelName}
        clearTheCanvas={clearTheCanvas}
        setClearTheCanvas={setClearTheCanvas}
      />
    </div>
  );
};

export default Whiteboard;
