import React from 'react'

const Lobby = () => {
    return (
        <div id="lobby-wrapper">
            <h1>DigiBoard</h1>
            <form id="lobby-form">
                <input type="text" placeholder="Choose a username" />
                <button>Create room</button>
            </form>
        </div>
    )
}

export default Lobby
