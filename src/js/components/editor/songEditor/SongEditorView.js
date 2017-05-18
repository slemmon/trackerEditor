import React, { Component } from 'react'
import ChannelRow from './ChannelRow'
import SongCode from './SongCode'
import customEventEmitter from '../../../customEventEmitter'

class SongEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            showCode: false
        }

        this.toggleShowCode = this.toggleShowCode.bind(this)
    }

    exportSong () {
        customEventEmitter('exportSong')
    }

    toggleShowCode () {
        const codeIsVisible = this.state.showCode
        if ( codeIsVisible )
            this.setState({
                showCode: false
            })
        else {
            this.setState({
                showCode: true
            })
            customEventEmitter('createSongCode')
        }
    }

    addDefaultVolumeFx (channel) {

        const channelsFx = this.state.channelsFx

        const fxList = Object.assign({}, channelsFx[channel])
        fxList.fx = Object.assign({}, fxList.fx)
        fxList.flags = fxList.flags | 1
        fxList.fx[1] = { val: 48 }

        channelsFx[channel] = fxList

        this.setState({
            channelsFx
        })

    }

    saveJSON () {
        customEventEmitter('saveJSON')
    }

    loadJSON () {
        customEventEmitter('loadJSON')
    }

    openChannelFx (channel) {
        this.props.toggleFxEditor(channel)
    }

    render () {
        const state = this.state
        return (
            <div id="song-editor-container">
                <h5>Song editor</h5>
                {/*<button onClick={ this.playSong }>Play</button>*/}
                {/*<button>Pause</button>*/}
                {/*<button onClick={ this.props.stopSong }>Stop</button>*/}
                <button onClick={ this.exportSong }>Export song</button>
                <button onClick={ this.saveJSON }>save</button>
                <button onClick={ this.loadJSON }>load</button>
                <button onClick={ this.toggleShowCode }>{ `${state.showString ? 'Hide' : 'Show'} code` }</button>

                <div className="song-editor-channels">

                    <div className="channel-titles">
                        <div className="channel-title">
                            <span><i className='fa fa-music' aria-hidden="true"></i></span>
                            <span>CH 0</span>
                        </div>
                        <div className="channel-title">
                            <span><i className='fa fa-music' aria-hidden="true"></i></span>
                            <span>CH 1</span>
                        </div>
                        <div className="channel-title">
                            <span><i className='fa fa-music' aria-hidden="true"></i></span>
                            <span>CH 2</span>
                        </div>
                        <div className="channel-title">
                            <span><i className='fa fa-superpowers' aria-hidden="true"></i></span>
                            <span>CH 3</span>
                        </div>
                    </div>

                    <div className="channel-tracks">
                        <div>
                            <ChannelRow
                                channel={0}
                            />
                            <ChannelRow
                                channel={1}
                            />
                            <ChannelRow
                                channel={2}
                            />
                            <ChannelRow
                                channel={3}
                            />
                        </div>
                    </div>

                    <div className="channel-fx-box">
                        <div className="channel-fx" onClick={ () => this.openChannelFx(0) }>FX</div>
                        <div className="channel-fx" onClick={ () => this.openChannelFx(1) }>FX</div>
                        <div className="channel-fx" onClick={ () => this.openChannelFx(2) }>FX</div>
                        <div className="channel-fx" onClick={ () => this.openChannelFx(3) }>FX</div>
                    </div>

                </div>

                <SongCode show={state.showCode} />

            </div>
        )
    }
}

export default SongEditor
