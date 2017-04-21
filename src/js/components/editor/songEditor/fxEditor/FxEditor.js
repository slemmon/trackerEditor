import React, { Component } from 'react'

class FxEditor extends Component {

    constructor (props) {
        super(props)

        const sortedFx = this.getSortedFx(props.channelFx)

        this.state = {
            channel: props.channel,
            activeFx: sortedFx.active,
            availableFx: sortedFx.available,
            selected: sortedFx.active[0]
        }

        this.addToUsed = this.addToUsed.bind(this)
        this.removeFromUsed = this.removeFromUsed.bind(this)
        this.setActiveEdit = this.setActiveEdit.bind(this)
        this.updateValue = this.updateValue.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const sortedFx = this.getSortedFx(nextProps.channelFx)
        let newSelection
        if ( nextProps.channel !== this.props.channel )
            newSelection = sortedFx.active[0]
        else
            newSelection = this.state.selected || sortedFx.active[0]
        this.setState({
            channel: nextProps.channel,
            activeFx: sortedFx.active,
            availableFx: sortedFx.available,
            selected: newSelection
        })
    }

    getSortedFx (fx) {
        const activeEffects = fx.flags,
              active = [],
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
        this.props.updateFlags(this.props.channel, fx, 'add', fxInfo[fx].values)
    }

    removeFromUsed (fx) {
        if ( fx === this.state.selected )
            this.setState({selected: 0}, () =>
                this.props.updateFlags(this.props.channel, fx, 'remove')
            )
        else
            this.props.updateFlags(this.props.channel, fx, 'remove')
    }

    setActiveEdit (fx) {
        this.setState({
            selected: fx
        })
    }

    updateValue (key, value) {
        this.props.updateFxValue(this.props.channel, this.state.selected, key, value)
    }

    render () {
        const state = this.state
        return (
            <div className="fx-editor-container">

                <h5>Channel Fx Editor</h5>

                <div className="channel-selector">
                    <label>Channel</label>
                    <input
                        type="number"
                        min="0"
                        max="3"
                        value={this.state.channel}
                        onChange={ e => this.setState({channel: e.target.value}) }
                        onBlur={ e => this.props.openChannelFx(parseInt(this.state.channel)) }
                    />
                </div>

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
                        data={this.props.channelFx.fx[state.selected]}
                        passNewValue={this.updateValue}
                    />
                </div>

            </div>
        )
    }
}

export default FxEditor

class Available extends Component {

    listOfEffects () {
        const myFx = this.props.fx
        const fx = []
        for ( let i = 0, l = myFx.length; i < l; i++ )
            fx.push(
                <FxItem
                    fx={myFx[i]}
                    key={i}
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
                <span className="fx-title">Available fx</span>
                <div className="fx-bordered-div">
                    {this.listOfEffects()}
                </div>
            </div>
        )
    }
}

const fxInfo = {
    1: {
        name: 'set volume',
        values: 1
    },
    2: {
        name: 'slide volume on',
        values: 1
    },
    4: {
        name: 'slide volume advanced',
        values: 2
    },
    8: {
        name: 'slide volume off',
        values: 0
    },
    16: {
        name: 'slide frequency on',
        values: 1
    },
    32: {
        name: 'slide frequency advanced',
        values: 2
    },
    64: {
        name: 'slide frequency off',
        values: 0
    },
    128: {
        name: 'set arpeggio',
        values: 2
    },
    256: {
        name: 'arpeggio off',
        values: 0
    },
    512: {
        name: 'set transposition',
        values: 1
    },
    1024: {
        name: 'add transposition',
        values: 1
    },
    2048: {
        name: 'transposition off',
        values: 0
    },
    4096: {
        name: 'set tremolo',
        values: 2
    },
    8192: {
        name: 'tremolo off',
        values: 0
    },
    16384: {
        name: 'set vibrato',
        values: 2
    },
    32768: {
        name: 'vibrato off',
        values: 0
    },
    65536: {
        name: 'set glissando',
        values: 1
    },
    131072: {
        name: 'glissando off',
        values: 0
    },
    262144: {
        name: 'set note cut',
        values: 1
    },
    524288: {
        name: 'note cut off',
        values: 0
    },
    1048576: {
        name: 'set tempo',
        values: 1
    },
    2097152: {
        name: 'add tempo',
        values: 1
    }
}

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

const ActiveEdit = ({fx: fxId, passNewValue, data}) => {
    const fx = fxInfo[fxId] || {}

    let options
    if ( fx.values === 1 ) {
        options = <SingleOption handleValueChange={passNewValue} data={data} />
    } else if ( fx.values === 2 ) {
        options = <DoubleOption handleValueChange={passNewValue} data={data} />
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

const SingleOption = ({handleValueChange, data}) =>
    <div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val', parseInt(e.target.value))}
                value={(data||{}).val || 0}
            />
        </div>
    </div>

const DoubleOption = ({handleValueChange, data}) =>
    <div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val', parseInt(e.target.value))}
                value={(data||{}).val || 0}
            />
        </div>
        <div className="input-group">
            <input
                type="number"
                onChange={e => handleValueChange('val_b', parseInt(e.target.value))}
                value={(data||{}).val_b || 0}
            />
        </div>
    </div>
