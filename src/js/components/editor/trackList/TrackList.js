import React, { Component } from 'react'
import { GithubPicker } from 'react-color'

const TrackList = ({tracks, createNewTrack, deleteTrack, setActiveTrack, setTrackColor}) =>
    <div id="track-list-container">
        <h5>Track list</h5>
        <button className="button" onClick = { () => createNewTrack('tune') }>New tune track</button>
        <button className="button" onClick = { () => createNewTrack('drum') }>New drum track</button>
        <ul className = "track-list">
        {tracks.map( (track, i) =>
            <TrackRow
                key = {i}
                index = {i}
                last = {tracks.length}
                track = {track}
                deleteTrack = {deleteTrack}
                setActiveTrack = {setActiveTrack}
                setTrackColor = {setTrackColor}
            />
        )}
        </ul>
    </div>

export default TrackList

const TrackRow = ({last, i, track, deleteTrack, setActiveTrack, setTrackColor}) =>
    <li className={`track-list-item ${ last === i + 1 ? 'track-list-item-last' : '' }`}>
        <span className="track-list-item-icon">
            <i className={`fa fa-${ track.type === 'tune' ? 'music' : 'superpowers' }`} aria-hidden="true"></i>
        </span>
        <span className="track-list-item-text">{`${track.name} - (${track.type})`}</span>
        <span className="track-list-item-text"><span>Ticks: </span><span>{track.ticks}</span></span>
        <span className="track-list-item-tickbar">
            <span
                draggable = { true }
                onDragStart = { e => { e.dataTransfer.setData('trackId', track.id); e.dataTransfer.setData('type', track.type) } }
                data-track-id = { track.id }
                className = { `track-list-item-tickbar-bar ${track.type === 'tune' ? 'tickbar-tune' : 'tickbar-drum' }` }
                style = {{ width: track.ticks * 2, backgroundColor: track.color }}
            ></span>
        </span>
        <span
            className = "track-list-item-buttons"
        >
            <Color track={track} setTrackColor={ setTrackColor } />
            <span onClick={ () => deleteTrack(track.id) }><i className="fa fa-trash-o" aria-hidden="true"></i></span>
            <span onClick={ () => setActiveTrack(track) }><i className="fa fa-pencil" aria-hidden="true"></i></span>
        </span>
    </li>


class Color extends Component {

    constructor () {
        super()

        this.state = {
            showPicker: false
        }

        this.toggle = this.toggle.bind(this)
        this.toggleOff = this.toggleOff.bind(this)

    }

    componentWillUnmount() {
        this.removeListener()
    }

    toggle (e) {
        const current = this.state.showPicker
        this.setState({showPicker: !current})

        if ( current )
            this.removeListener()
        else
            document.addEventListener('click', this.toggleOff)
    }

    removeListener () {
        document.removeEventListener('click', this.toggleOff)
    }

    toggleOff (e) {
        this.setState({showPicker: false})
        this.removeListener()
    }

    render () {
        const state = this.state
        const track = this.props.track
        return (
            <span
                className = "track-list-item-buttons-color-button"
                style = {{ backgroundColor: track.color }}
                onClick = { this.toggle }
            >
                { state.showPicker ?
                    <span className="colorpicker">
                        <GithubPicker
                            color = { track.color }
                            onChangeComplete = { color => this.props.setTrackColor(track.id, color) }
                            colors = {['#ff7e00', '#ff69a8', '#00a8cc', '#00d2ae', '#584d4d', '#7171d8', '#df2020', '#24eb24', '#ffcc99', '#ffbdd8', '#85e9ff', '#75ffe8', '#aea2a2', '#b7b7eb', '#ef8f8f', '#98f598']}
                        />
                    </span>
                    :null
                }
            </span>
        )
    }
}
