import React, { Component } from 'react'
import TrackRow from './TrackRow'

class TrackList extends Component {
    state = {
        activeTrack: null
    }

    setActiveTrack = (track) => {
        this.setState({
            activeTrack: track.id
        });
        this.props.setActiveTrack(track, track.type);
    }

    render () {
        const { tracks, createNewTrack, deleteTrack, setTrackColor } = this.props
        const { activeTrack } = this.state

        return (
            <div id="track-list-container">
                <h5>Track list</h5>
                <button className="button" onClick = { () => createNewTrack('tune') }>New tune track</button>
                <button className="button" onClick = { () => createNewTrack('drum') }>New drum track</button>
                <ul className = "track-list">
                {tracks.map( (track, i) =>
                    <TrackRow
                        activeTrack = {activeTrack}
                        key = {track.id}
                        index = {i}
                        // last = {tracks.length}
                        isLast = {i === tracks.length - 1}
                        track = {track}
                        deleteTrack = {deleteTrack}
                        setActiveTrack = {this.setActiveTrack}
                        setTrackColor = {setTrackColor}
                    />
                )}
                </ul>
            </div>
        )
    }
}

export default TrackList
