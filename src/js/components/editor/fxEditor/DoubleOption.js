import React, { Component } from 'react'

const DoubleOption = ({handleValueChange, data}) =>
    <div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_0', parseInt(e.target.value))}
                value={(data||{}).val_0 || 0}
            />
        </div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_1', parseInt(e.target.value))}
                value={(data||{}).val_1 || 0}
            />
        </div>
    </div>

export default DoubleOption
