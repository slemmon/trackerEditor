import React, { Component } from 'react'
import ChannelFxEditor from './ChannelFxEditor'

class FxEditor extends Component {
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

        switch (type) {

            case 'channel':
            const fx = props.fx[props.fx.status.fxType][props.fx.status.id]
            editor = <ChannelFxEditor
                    addFx = {this.addFx}
                    removeFx = {this.removeFx}
                    updateFx = {this.updateFx}
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

export default FxEditor
