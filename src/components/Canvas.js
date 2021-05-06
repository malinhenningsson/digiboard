import { useEffect, useState, useRef } from "react";
import { usePubnub } from "../contexts/PubNubContext";

const Canvas = ({
  canvasRef,
  color,
  channelName,
  clearTheCanvas,
  setClearTheCanvas,
}) => {
  const [ctx, setCtx] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const parentRef = useRef(null);
  let plots = [];

  // Get pubnub connections
  const { publishToChannel, canvasData } = usePubnub();

  // Set up canvas and context
  useEffect(() => {
    const canv = canvasRef.current;
    canv.width = parentRef.current.offsetWidth;
    canv.height = parentRef.current.offsetHeight;

    // Set up canvas context
    const canvContext = canv.getContext("2d");
    canvContext.lineJoin = "round";
    canvContext.lineCap = "round";
    canvContext.lineWidth = 5;
    setCtx(canvContext);

    // Record canvas left and top offset
    const offset = canv.getBoundingClientRect();
    setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
  }, [ctx, canvasRef, parentRef]);

  // Listen to new recieved data
  useEffect(() => {
    if (!ctx) return;
    if (canvasData === null || undefined) return;

    if (
      (canvasData.positions !== undefined || null) &&
      canvasData.positions.length > 0
    ) {
      drawFromStream(canvasData);
    }
    if (canvasData.clearTheCanvas) {
      clearCanvas();
    }
  }, [canvasData]);

  // Listen to press on clear canvas button
  useEffect(() => {
    if (!clearTheCanvas) return;
    clearCanvas();
  }, [clearTheCanvas]);

  // Clear canvas from strokes
  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    publishToChannel(channelName, {
      canvas: {
        clearTheCanvas: clearTheCanvas,
      },
    });
    setClearTheCanvas(false);
  };

  // Draw on canvas using other users strokes
  const drawFromStream = (data) => {
    if (!data || data.positions === undefined) return;
    drawOnCanvas(data.color, data.positions);
  };

  // Draw strokes on canvas from mousemovements
  const drawOnCanvas = (color, positions) => {
    if (!ctx) return;
    if (positions[0].x === undefined || null) return;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(positions[0].x, positions[0].y);

    positions.forEach((position) => {
      ctx.lineTo(position.x, position.y);
    });
    ctx.stroke();
  };

  // Register mousemovements
  const draw = (e) => {
    e.preventDefault();
    if (!isActive) return;

    const mousex = e.clientX - canvasOffset.x;
    const mousey = e.clientY - canvasOffset.y;

    plots.push({ x: mousex, y: mousey });

    drawOnCanvas(color, plots);
  };

  // Start drawing on mouse down
  const startDraw = (e) => {
    e.preventDefault();
    setIsActive(true);
  };

  // End drawing on mouse up
  const endDraw = (e) => {
    e.preventDefault();
    setIsActive(false);

    publishToChannel(channelName, {
      canvas: {
        color: color,
        positions: plots,
      },
    });

    plots = [];
  };

  return (
    <div id="canvas-wrapper" ref={parentRef}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseUp={endDraw}
        onMouseMove={draw}
      />
    </div>
  );
};

export default Canvas;
