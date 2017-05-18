import React, { Component } from 'react'
import Body from './Body'
import Player from './player/Player'
import Loader from './Loader'

class App extends Component {
    render () {
        return (
            <div id="app-container">
                <Body />
                <Player />
                <Loader />
            </div>
        )
    }
}

export default App
