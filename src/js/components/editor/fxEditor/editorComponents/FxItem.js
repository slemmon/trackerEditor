import React, { Component } from 'react'
import fxInfo from '../../../../fxInfo'

class FxItem extends Component {

    constructor () {
        super()

        this.addToUsed = this.addToUsed.bind(this)
        this.setActiveEdit = this.setActiveEdit.bind(this)
        this.removeFromUsed = this.removeFromUsed.bind(this)
    }

    getName (fxId) {
        return (fxInfo[fxId]||{name:'ERROR: fx doesn\'t exist'}).name
    }

    addToUsed () {
        if ( !this.props.edit )
            this.props.addToUsed(this.props.fx)
    }

    removeFromUsed () {
        this.props.removeFromUsed(this.props.fx)
    }

    setActiveEdit () {
        this.props.setActiveEdit(this.props.fx)
    }

    render () {
        return (
            <div className="fx-item">
                <span className="fx-item-name" onClick={this.addToUsed}>
                    {this.getName(this.props.fx)}
                </span>
                <span className="fx-item-buttons" style={ {display: this.props.edit ? '' : 'none'} }>
                    <span onClick={this.removeFromUsed}><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    <span onClick={this.setActiveEdit}><i className="fa fa-pencil" aria-hidden="true"></i></span>
                </span>
            </div>
        )
    }
}

export default FxItem
