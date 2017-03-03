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
// class TrackRow extends Component {
//     constructor (props) {
//         super(props)

//         this.handleDragStart = this.handleDragStart.bind(this)
//     }

//     handleDragStart (e) {
//         e.dataTransfer.setData('trackId', this.props.track.id)
//     }

//     render () {
        // const {
        //     last,
        //     i,
        //     track,
        //     deleteTrack,
        //     setActiveTrack
        // } = this.props
        // return (
            <li className={`track-list-item ${ last === i + 1 ? 'track-list-item-last' : '' }`}>
                <span className="track-list-item-icon"><i className="fa fa-music" aria-hidden="true"></i></span>
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
//         )
//     }
// }


class Color extends Component {

    constructor () {
        super()

        this.state = {
            showPicker: false
        }

    }

    render () {
        const state = this.state
        const track = this.props.track
        return (
            <span
                className = "track-list-item-buttons-color-button"
                style = {{ backgroundColor: track.color }}
                onClick = { e => this.setState({showPicker: !state.showPicker}) }
            >
                { state.showPicker ?
                    <span className="colorpicker">
                        <GithubPicker
                            color = { track.color }
                            onChangeComplete = { color => this.props.setTrackColor(track.id, color) }
                        />
                    </span>
                    :null
                }
            </span>
        )
    }
}
