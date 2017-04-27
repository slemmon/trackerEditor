import React, { Component } from 'react'
import Editor from './editor/Editor'
import Player from './player/Player'

class Body extends Component {
    render () {
        return (
            <div id="app-body-container">
                <Editor />
                <Player />
            </div>
        )
    }
}

export default Body
