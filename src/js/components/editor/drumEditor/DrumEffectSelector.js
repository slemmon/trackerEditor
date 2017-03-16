import React, { Component } from 'react'

class DrumEffectSelector extends Component {
    render () {
        const effectName = this.props.name
        return (
            <span className="drum-selector" onClick={ e => this.props.selectEffect(effectName) }>
                <span className="effect-text">{effectName.replace(/_/g, ' ')}</span>
                <span className={`effect-preview ${effectName}`}></span>
                { this.props.selected ?
                    <span>
                        <span>&nbsp;</span>
                        <ArrowIcon />
                    </span>
                    :null
                }
            </span>
        )
    }
}

const ArrowIcon = () => <i className="fa fa-arrow-left" aria-hidden="true"></i>

export default DrumEffectSelector
