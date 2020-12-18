import { useEffect, useRef, useState } from 'react';

const Canvas = ({ parentRef, color }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState({});
    const [drawing, setDrawing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

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
        setDrawing(true);

        setPosition({
            x: parseInt(e.clientX - canvasOffset.x),
            y: parseInt(e.clientY - canvasOffset.y),
          });
    }

    // End drawing
    const handleMouseUp = (e) => {
        setDrawing(false);
    }

    // Handle drawing activity
    const handleMouseMove = (e) => {
        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;

        if (drawing) {
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

export default Canvas
