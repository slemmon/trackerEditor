import React, { Component } from 'react'
import ChannelRow from './ChannelRow'
import SongCode from './SongCode'
import customEventEmitter from '../../../customEventEmitter'

class SongEditor extends Component {
    state = {
        dropIndicatorColor: '#00969b',
        dropIndicatorPos: {
            x: 0,
            y: 0
        },
        isMuted: false,
        showCode: false,
        showDropIndicator: false
    }

    exportSong () {
        customEventEmitter('exportSong')
    }

    toggleShowCode = () => {
        const { showCode } = this.state

        this.setState({
            showCode: !showCode
        })

        if (!showCode) {
            customEventEmitter('createSongCode')
        }
    }

    addDefaultVolumeFx (channel) {
        const { channelsFx } = this.state

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

    /**
     * Shows the insert-pattern indicator when a pattern is dragged over another
     * existing pattern in the song editor
     * @param {Object} meta The pattern meta object used to show / decorate the
     * insert-pattern indicator
     */
    showDropIndicator = ({ color, x, y }) => {
        // we need to find the channel row container's position in order to
        // figure placement of the drop indicator
        const { left, top } = this.channelsCt.getBoundingClientRect()
        
        // show the drop indicator next to the target pattern
        this.setState({
            showDropIndicator: true,
            dropIndicatorPos: {
                x: x - left - 1,
                y: top - y + 13
            },
            dropIndicatorColor: color
        })
    }

    /**
     * Hides the insert-pattern drop indicator
     */
    hideDropIndicator = () => {
        this.setState({
            showDropIndicator: false
        })
    }

    /**
     * Return all channel rows
     * @param {Number} activeFx The index of the effects currently being
     * reviewed in the UI (if any)
     * @return {Array} The array of <ChannelRow>s
     */
    getChannelRows (activeFx) {
        const channels = []

        for (let i = 0; i < 4; i++) {
            channels.push(
                <ChannelRow
                    key={i}
                    channel={i}
                    editingFx={activeFx === i}
                    showDropIndicator={this.showDropIndicator}
                    hideDropIndicator={this.hideDropIndicator}
                />
            )
        }

        return channels
    }

    /**
     * Returns all channel Fx buttons
     * @param {Number} activeFx The index of the effects currently being
     * reviewed in the UI (if any)
     * @return {Array} The array of channel Fx buttons
     */
    getChannelFxButtons (activeFx) {
        const buttons = []

        for (let i = 0; i < 4; i++) {
            const activeFxCls = (activeFx === i) ? 'active' : ''

            buttons.push(
                <button
                    className={`channel-fx ${activeFxCls}`}
                    onClick={ () => this.openChannelFx(i) }
                >
                    FX
                </button>
            )
        }

        return buttons
    }

    render () {
        const state = this.state
        const { dropIndicatorColor, showDropIndicator } = state
        const { x, y } = state.dropIndicatorPos
        const dropIndicatorStyle = {
            display: showDropIndicator ? 'block' : 'none',
            left: x,
            top: y,
            color: dropIndicatorColor
        }
        const {
            onSongNameChange, songIsPlaying, songName, songRepeat
        } = this.props
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
                            checked={songRepeat}
                        />
                    </label>
                    <div style={{flex: 1}}></div>
                    <button onClick={this.toggleMute}>
                        {`${state.isMuted ? 'un' : ''}mute`}
                    </button>
                </div>

                <div className="song-editor-channels">

                    <div className="channel-titles">
                        <div className="channel-title">
                            <span>
                                <i className='fa fa-music' aria-hidden="true" />
                            </span>
                            <span>CH 0</span>
                        </div>
                        <div className="channel-title">
                            <span>
                                <i className='fa fa-music' aria-hidden="true" />
                            </span>
                            <span>CH 1</span>
                        </div>
                        <div className="channel-title">
                            <span>
                                <i className='fa fa-music' aria-hidden="true" />
                            </span>
                            <span>CH 2</span>
                        </div>
                        <div className="channel-title">
                            <span>
                                <i
                                    className='fa fa-superpowers'
                                    aria-hidden="true"
                                />
                            </span>
                            <span>CH 3</span>
                        </div>
                    </div>

                    <div
                        ref={el => this.channelsCt = el}
                        className="channel-patterns"
                        id="channel-patterns"
                    >
                        <div>
                            {this.getChannelRows(activeFx)}
                        </div>
                        <div
                            id="insert-indicator"
                            style={dropIndicatorStyle}
                        ></div>
                    </div>

                    <div className="channel-fx-box">
                        {this.getChannelFxButtons(activeFx)}
                    </div>

                </div>

                <SongCode show={state.showCode} isNew={state.isNew} />

            </div>
        )
    }
}

export default SongEditor
