import React, { Component } from 'react'
import FxItem from './FxItem'

class Used extends Component {

    listOfEffects () {
        const myFx = this.props.fx
        const fx = []
        for ( let i = 0, l = myFx.length; i < l; i++ )
            fx.push(
                <FxItem
                    fx={myFx[i]}
                    key={i}
                    edit={true}
                    addToUsed={this.props.addToUsed}
                    removeFromUsed={this.props.removeFromUsed}
                    setActiveEdit={this.props.setActiveEdit}
                />
            )

        return fx
    }

    render () {
        return (
            <div className="fx-container">
                <span className="fx-title">Used fx</span>
                <div className="fx-bordered-div">
                    {this.listOfEffects()}
                </div>
            </div>
        )
    }
}

export default Used
