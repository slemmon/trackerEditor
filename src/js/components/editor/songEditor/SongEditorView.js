import React, { Component } from 'react'
import ChannelRow from './ChannelRow'
import SongCode from './SongCode'
import customEventEmitter from '../../../customEventEmitter'

class SongEditor extends Component {
    constructor (props) {
        super(props)

        this.state = {
            showCode: false,
            isMuted: false
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

    /**
     * Plays the currently loaded song
     */
    playSong = () => {
        this.setState({
            // toggles playing indicator for play / stop btn
            songIsPlaying: true
        })
        customEventEmitter('playCompleteSong')
    }

    /**
     * Stops playing the currently loaded song
     */
    stopSong = () => {
        customEventEmitter('stopPlaying')
    }

    toggleMute = () => {
        const newState = !this.state.isMuted
        this.setState({
            isMuted: newState
        })
        customEventEmitter('toggleMute')
    }

    render () {
        const state = this.state
        const { onSongNameChange, songIsPlaying, songName } = this.props
        const defaultTip = 'ENTER A SONG NAME'
        const saveTip = songName.length ? `SAVE ${songName}.atm` : defaultTip
        const exportTip = songName.length ? `EXPORT ${songName}.h` : defaultTip
        const playOrStop = songIsPlaying ? 'stopSong' : 'playSong'
        const playOrStopText = songIsPlaying ? 'Stop' : 'Play'
        const { fxStatus, toggleSongRepeat } = this.props
        const activeFx = fxStatus.fxType === 'channel' && fxStatus.id
        return (
            <div id="song-editor-container">
                <h5>
                    Song editor
                    <div style={{flex: 1}}></div>
                    <input
                        value={songName}
                        onChange={onSongNameChange}
                        id="song-title"
                        placeholder="song title..."
                    />
                    <button
                        onClick={ this.saveJSON }
                        disabled={!songName.length}
                        data-tooltip={saveTip}
                    >
                        <i
                            className="fa fa-save"
                            aria-hidden="true"
                        />
                    </button>
                    <button
                        onClick={ this.exportSong }
                        disabled={!songName.length}
                        data-tooltip={exportTip}
                    >
                        <i
                            disabled={!songName.length}
                            className="fa fa-download"
                            aria-hidden="true"
                        />
                    </button>
                    <button onClick={ this.loadJSON }>load</button>
                    <button onClick={ this.toggleShowCode }>
                        { `${state.showCode ? 'Hide' : 'Show'} code` }
                    </button>
                </h5>
                
                <div className="song-editor-controls">
                    <button onClick={ this[playOrStop] }>
                        {`${playOrStopText}`} Song
                    </button>
                    <label>
                        Repeat
                        <input
                            type="checkbox"
                            onChange={ e => toggleSongRepeat(e.target.checked) }
                        />
                    </label>
                    <div style={{flex: 1}}></div>
                    <button onClick={this.toggleMute}>{ `${state.isMuted ? 'un' : ''}mute` }</button>
                </div>

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
                                editingFx={activeFx===0}
                            />
                            <ChannelRow
                                channel={1}
                                editingFx={activeFx===1}
                            />
                            <ChannelRow
                                channel={2}
                                editingFx={activeFx===2}
                            />
                            <ChannelRow
                                channel={3}
                                editingFx={activeFx===3}
                            />
                        </div>
                    </div>

                    <div className="channel-fx-box">
                        <button className={`channel-fx ${ activeFx === 0 ? 'active' : '' }`} onClick={ () => this.openChannelFx(0) }>FX</button>
                        <button className={`channel-fx ${ activeFx === 1 ? 'active' : '' }`} onClick={ () => this.openChannelFx(1) }>FX</button>
                        <button className={`channel-fx ${ activeFx === 2 ? 'active' : '' }`} onClick={ () => this.openChannelFx(2) }>FX</button>
                        <button className={`channel-fx ${ activeFx === 3 ? 'active' : '' }`} onClick={ () => this.openChannelFx(3) }>FX</button>
                    </div>

                </div>

                <SongCode show={state.showCode} isNew={state.isNew} />

            </div>
        )
    }
}

export default SongEditor
