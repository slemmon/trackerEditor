import React from 'react'
import TrackRow from './TrackRow'

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
