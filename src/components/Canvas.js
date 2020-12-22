import { useEffect, useRef, useState } from 'react';
import { usePubnub } from '../contexts/PubNubContext';

const Canvas = ({ parentRef, color, channelName }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState({});
    const [isActive, setIsActive] = useState(false);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    let plots = [];

    // Get pubnub connections
    const { publishToChannel, recievedData} = usePubnub();

    // Set up canvas and context
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

    // Listen to new recieved data
    useEffect(() => {
        if (!ctx) return;
        drawFromStream(recievedData);
    }, [recievedData])

    // Draw on canvas using other users strokes
    const drawFromStream = (data) => {
        if(!data || data.positions === undefined) return;
        drawOnCanvas(data.color, data.positions);
    }

    // Draw strokes on canvas from mousemovements
    const drawOnCanvas = (color, positions) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);

        positions.forEach(position => {
            ctx.lineTo(position.x, position.y)
        })

        ctx.stroke();
    }

    // Register mousemovements
    const draw = (e) => {
        e.preventDefault(); 
        if(!isActive) return;

        let mousex = e.clientX - canvasOffset.x;
        let mousey = e.clientY - canvasOffset.y;

        plots.push({x: mousex, y: mousey}); 

        drawOnCanvas(color, plots);
    }

    // Start drawing on mouse down
    const startDraw = (e) => {
        e.preventDefault();
        setIsActive(true);
    }

    // End drawing on mouse up
    const endDraw = (e) => {
        e.preventDefault();
        setIsActive(false);

        publishToChannel(channelName, {
            color: color,
            positions: plots,
        })

        plots = [];
    }
 
    return (
        <div id="canvas-wrapper" ref={parentRef}>
            <canvas 
                ref={canvasRef} 
                onMouseDown={startDraw}
                onMouseUp={endDraw}
                onMouseMove={draw}
            />
        </div>
    )
}

export default Canvas
