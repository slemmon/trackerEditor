import React, { Component } from 'react'
import Available from './Available'
import Used from './Used'
import ActiveEdit from './ActiveEdit'

class ChannelFxEditor extends Component {
    constructor (props) {
        super()

        const sorted = this.getSortedFx(props.flags)

        this.state = {
            activeFx: sorted.active,
            availableFx: sorted.available,
            selected: sorted.active[0]
        }

        this.addToUsed = this.addToUsed.bind(this)
        this.removeFromUsed = this.removeFromUsed.bind(this)
        this.setActiveEdit = this.setActiveEdit.bind(this)
        this.updateValue = this.updateValue.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        const sorted = this.getSortedFx(nextProps.flags)

        this.setState({
            activeFx: sorted.active,
            availableFx: sorted.available
        })
    }

    getSortedFx (activeEffects) {
        const active = [],
              available = []

        for ( let i = 1; i <= 2097152; i *= 2 ) {
            if ( activeEffects & i )
                active.push(i)
            else
                available.push(i)
        }

        return {
            active, available
        }
    }

    addToUsed (fx) {
        this.props.addFx(fx)
    }

    removeFromUsed (fx) {
        console.log('removeFromUsed', fx)
        if ( fx === this.state.selected )
            this.setState({selected: 0}, () =>
                this.props.removeFx(fx)
            )
        else
            this.props.removeFx(fx)
    }

    updateValue (key, value) {
        this.props.updateFx(this.state.selected, key, value)
    }

    setActiveEdit (fx) {
        this.setState({
            selected: fx
        })
    }

    render () {
        const props = this.props
        const state = this.state
        return (
            <div className="fx-editor-channel">
                <h5>Channel Fx Editor</h5>

                {/*<div className="channel-selector">
                    <label>Channel</label>
                    <input
                        type="number"
                        min="0"
                        max="3"
                        value={state.channel}
                        onChange={ e => this.setState({channel: e.target.value}) }
                        onBlur={ e => props.openChannelFx(parseInt(state.channel)) }
                    />
                </div>*/}

                <div className="fx-lists">
                    <Available
                        fx={state.availableFx}
                        addToUsed={this.addToUsed}
                        removeFromUsed={this.removeFromUsed}
                        setActiveEdit={this.setActiveEdit}
                    />
                    <Used
                        fx={state.activeFx}
                        addToUsed={this.addToUsed}
                        removeFromUsed={this.removeFromUsed}
                        setActiveEdit={this.setActiveEdit}
                    />
                    <ActiveEdit
                        fx={state.selected}
                        data={props.fx[state.selected]}
                        passNewValue={this.updateValue}
                    />
                </div>
            </div>
        )
    }
}

export default ChannelFxEditor
