import { useEffect, useRef, useState } from 'react';
import { usePubnub } from '../contexts/PubNubContext';

const Canvas = ({ parentRef, color, channelName }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

    // Get pubnub connections
    const { publishToChannel, subscribeToChannel, recievedData} = usePubnub();

    
    useEffect(() => {
        let canv = canvasRef.current;
        canv.width = parentRef.current.offsetWidth;
        canv.height = parentRef.current.offsetHeight;
        
        // Set up canvas context
        let canvContext = canv.getContext('2d');
        canvContext.lineJoin = "round";
        canvContext.lineCap = "round";
        canvContext.lineWidth = 5;
        setCtx(canvContext);
        
        // Record canvas left and top offset 
        let offset = canv.getBoundingClientRect();
        setCanvasOffset({ x: parseInt(offset.left), y: parseInt(offset.top) });
    }, [ctx]);
    
    // Start drawing
     const handleMouseDown = (e) => {
         setIsActive(true);

         setPosition({
             x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
           });
     }

     // End drawing
     const handleMouseUp = (e) => {
         setIsActive(false);

         publishToChannel(channelName, {
             color: color,
             positions: position,
         });

     }

     // Handle drawing activity
     const handleMouseMove = (e) => {
         let mousex = e.clientX - canvasOffset.x;
         let mousey = e.clientY - canvasOffset.y;

         if (isActive) {
             ctx.strokeStyle = color;
             ctx.beginPath();
             ctx.moveTo(position.x, position.y);
             ctx.lineTo(mousex, mousey);
             ctx.stroke();
         }
         setPosition({ x: mousex, y: mousey });
     }

     return (
        <div id="canvas-wrapper" ref={parentRef}>
            <canvas 
                ref={canvasRef} 
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </div>
    )
}