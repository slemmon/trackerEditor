import React, { Component } from 'react'

const SingleOption = ({handleValueChange, data}) =>
    <div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_0', parseInt(e.target.value))}
                value={(data||{}).val_0 || 0}
            />
        </div>
    </div>

export default SingleOption
