import React, { useRef } from 'react'
import Canvas from './Canvas'
import ToolPicker from './ToolPicker'

const Whiteboard = () => {
    const parentRef = useRef(null);

    return (
        <div id="whiteboard-wrapper" ref={parentRef}>
            <ToolPicker />
            <Canvas parentRef={parentRef} />
        </div>
    )
}

export default Whiteboard
