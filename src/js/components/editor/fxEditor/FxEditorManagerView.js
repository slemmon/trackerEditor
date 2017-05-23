import React, { Component } from 'react'
import FxEditor from './FxEditor'

class FxEditorManager extends Component {
    constructor (props) {
        super(props)

        this.addFx = this.addFx.bind(this)
        this.removeFx = this.removeFx.bind(this)
        this.updateFx = this.updateFx.bind(this)
    }

    addFx (fx) {
        this.props.addFx(this.props.fx.status, fx)
    }

    removeFx (fx) {
        this.props.removeFx(this.props.fx.status, fx)
    }

    updateFx (fx, key, value) {
        this.props.updateFx(this.props.fx.status, fx, key, value)
    }

    render () {
        const state = this.state
        const props = this.props

        const type = props.fx.status.fxType
        let editor

        let fx
        switch (type) {

            case 'channel':
            fx = props.fx[props.fx.status.fxType][props.fx.status.id]
            editor = <FxEditor
                    id = {props.fx.status.id}
                    type="channel"
                    addFx = {this.addFx}
                    removeFx = {this.removeFx}
                    updateFx = {this.updateFx}
                    {...fx}
                 />
            break

            case 'track':
            fx = props.fx[props.fx.status.fxType][props.fx.status.id] || { flags: false, fx: [] }
            editor = <FxEditor
                    id = {props.fx.status.id}
                    type="track"
                    addFx = {this.addFx}
                    removeFx = {this.removeFx}
                    updateFx = {this.updateFx}
                    initFx = {props.initFx}
                    {...fx}
                />
            break

            default: editor = <p>nobody here</p>
        }

        return (
            <div id="fx-editor-container" className={`${props.fx.enabled ? '' : 'hidden' }`}>

                {editor}

            </div>
        )
    }
}

export default FxEditorManager
