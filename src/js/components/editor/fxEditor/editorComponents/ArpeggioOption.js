import React, { Component } from 'react'

const ArpeggioOption = ({handleValueChange, data}) =>
    <div>
        <div className="input-group">
            <input
                type="checkbox"
                onChange={e => handleValueChange('val_0', e.target.checked)}
                checked={(data||{}).val_0 || 0}
                id="checkbox_1"
            />
            <label htmlFor="checkbox_1">use only 2nd note</label>
        </div>
        <div className="input-group">
            <input
                type="checkbox"
                onChange={e => handleValueChange('val_1', e.target.checked)}
                checked={(data||{}).val_1 || 0}
                id="checkbox_2"
            />
            <label htmlFor="checkbox_2">retrigger</label>
        </div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_2', limitValue(parseInt(e.target.value), 0, 15))}
                value={(data||{}).val_2 || 0}
                min="0"
                max="15"
                id="note_1"
            />
            <label htmlFor="note_1">2nd note</label>
        </div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_3', limitValue(parseInt(e.target.value), 0, 15))}
                value={(data||{}).val_3 || 0}
                min="0"
                max="15"
                id="note_2"
            />
            <label htmlFor="note_2">3rd note</label>
        </div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_4', limitValue(parseInt(e.target.value), 0, 63))}
                value={(data||{}).val_4 || 0}
                min="0"
                max="63"
                id="ticks"
            />
            <label htmlFor="ticks">ticks</label>
        </div>
    </div>

export default ArpeggioOption

function limitValue (value, min, max) {
    return value < min ? min : ( value > max ? max : value )
}
