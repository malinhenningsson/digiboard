import React, { useRef, useState } from 'react'
import Canvas from './Canvas'
import ToolPicker from './ToolPicker'

const Whiteboard = () => {
    const parentRef = useRef(null);
    const [color, setColor] = useState("#000000");

    return (
        <div id="whiteboard-wrapper" ref={parentRef}>
            <ToolPicker color={color} setColor={setColor} />
            <Canvas parentRef={parentRef} color={color} />
        </div>
    )
}

export default Whiteboard
