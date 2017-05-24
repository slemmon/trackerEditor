import React, { Component } from 'react'
import Available from './editorComponents/Available'
import Used from './editorComponents/Used'
import ActiveEdit from './editorComponents/ActiveEdit'

class FxEditor extends Component {
    constructor (props) {
        super()

        const sorted = this.getSortedFx(props.flags || 0)

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

    componentDidMount() {
        const props = this.props
        if ( props.type === 'track' && props.flags === false )
            props.initFx(props.id)
    }

    componentWillReceiveProps (nextProps) {
        const sorted = this.getSortedFx(nextProps.flags)

        let selected

        if ( nextProps.id !== this.props.id || nextProps.type !== this.props.type ) {
            selected = sorted.active[0]
        } else
            selected = this.state.selected

        this.setState({
            activeFx: sorted.active,
            availableFx: sorted.available,
            selected
        })

        if ( nextProps.type === 'track' && nextProps.id !== this.props.id && nextProps.flags === false )
            nextProps.initFx(nextProps.id)
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
                <h5>{`${props.type === 'channel' ? 'Channel' : 'Track'} Fx Editor`}</h5>
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

export default FxEditor
