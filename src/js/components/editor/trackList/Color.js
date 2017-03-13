import React, { Component } from 'react'
import { GithubPicker } from 'react-color'
import stringifyColor from '../../../stringifyColor'

class Color extends Component {

    constructor () {
        super()

        this.state = {
            showPicker: false
        }

        this.toggle = this.toggle.bind(this)
        this.toggleOff = this.toggleOff.bind(this)

    }

    componentWillUnmount () {
        this.removeListener()
    }

    toggle (e) {
        const current = this.state.showPicker
        this.setState({showPicker: !current})

        if ( current )
            this.removeListener()
        else
            document.addEventListener('click', this.toggleOff)
    }

    removeListener () {
        document.removeEventListener('click', this.toggleOff)
    }

    toggleOff (e) {
        this.setState({showPicker: false})
        this.removeListener()
    }

    render () {
        const state = this.state
        const track = this.props.track
        return (
            <span
                className = "track-list-item-buttons-color-button"
                style = {{ backgroundColor: stringifyColor(track.color, 'hex') }}
                onClick = { this.toggle }
            >
                { state.showPicker ?
                    <span className="colorpicker">
                        <GithubPicker
                            onChangeComplete = { color => this.props.setTrackColor(track.id, color) }
                            colors = {['#ff7e00', '#ff69a8', '#00a8cc', '#00d2ae', '#584d4d', '#7171d8', '#df2020', '#24eb24', '#ffcc99', '#ffbdd8', '#85e9ff', '#75ffe8', '#aea2a2', '#b7b7eb', '#ef8f8f', '#98f598']}
                        />
                    </span>
                    :null
                }
            </span>
        )
    }
}

export default Color


// ['rgba(255, 126, 0, 1)', '#ff69a8', '#00a8cc', '#00d2ae', '#584d4d', '#7171d8', '#df2020', '#24eb24', '#ffcc99', '#ffbdd8', '#85e9ff', '#75ffe8', '#aea2a2', '#b7b7eb', '#ef8f8f', '#98f598']

// ['#ff7e00', '#ff69a8', '#00a8cc', '#00d2ae', '#584d4d', '#7171d8', '#df2020', '#24eb24', '#ffcc99', '#ffbdd8', '#85e9ff', '#75ffe8', '#aea2a2', '#b7b7eb', '#ef8f8f', '#98f598']