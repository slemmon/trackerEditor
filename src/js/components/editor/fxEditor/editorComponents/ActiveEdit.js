import React, { Component } from 'react'
import SingleOption from './SingleOption'
import DoubleOption from './DoubleOption'
import ArpeggioOption from './ArpeggioOption'
import fxInfo from '../../../../fxInfo'

const ActiveEdit = ({fx: fxId, passNewValue, data}) => {
    const fx = fxInfo[fxId] || {}

    let options
    if ( fx.values === 1 ) {
        options = <SingleOption handleValueChange={passNewValue} data={data} />
    } else if ( fx.values === 2 ) {
        options = <DoubleOption handleValueChange={passNewValue} data={data} />
    } else if ( fx.values === 5 ) {
        options = <ArpeggioOption handleValueChange={passNewValue} data={data} />
    }

    return (
        <div className="fx-container">
            <span className="fx-title">Settings fx</span>
            <div className="fx-bordered-div">
                <span>{fx.name}</span>
                {options}
            </div>
        </div>
    )
}

export default ActiveEdit
