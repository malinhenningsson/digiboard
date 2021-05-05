import React, { useRef, useState } from "react";
import Canvas from "./Canvas";
import ToolPicker from "./ToolPicker";
import { jsPDF } from "jspdf";

const Whiteboard = ({ channelName, showInviteUsers, setShowInviteUsers }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [clearTheCanvas, setClearTheCanvas] = useState(false);

  const handleDownloadCanvas = () => {
    const pdf = new jsPDF("l", "px", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const imgData = canvasRef.current.toDataURL("image/png", 1.0);
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("sample-file.pdf");
  };

  return (
    <div id="whiteboard-wrapper">
      <ToolPicker
        color={color}
        setColor={setColor}
        channelName={channelName}
        setClearTheCanvas={setClearTheCanvas}
        showInviteUsers={showInviteUsers}
        setShowInviteUsers={setShowInviteUsers}
        handleDownloadCanvas={handleDownloadCanvas}
      />
      <Canvas
        canvasRef={canvasRef}
        color={color}
        channelName={channelName}
        clearTheCanvas={clearTheCanvas}
        setClearTheCanvas={setClearTheCanvas}
      />
    </div>
  );
};

export default Whiteboard;
