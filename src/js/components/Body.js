import React, { Component } from 'react'
import Editor from './editor/Editor'

class Body extends Component {
    render () {
        return (
            <div id="app-body-container">
                <Editor />
            </div>
        )
    }
}

export default Body
