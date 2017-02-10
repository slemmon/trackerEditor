import React, { Component } from 'react'

const TrackList = ({tracks, createNewTrack, deleteTrack, setActiveTrack}) => {
    const last = tracks.length
    return (
        <div>
            <h5>Track list</h5>
            <span onClick = { () => createNewTrack('tune') }>New tune track</span>
            <span onClick = { () => createNewTrack('drum') }>New drum track</span>
            <ul className = "track-list">
            {tracks.map( (t, i) =>
                <li key={i} className={`track-list-item ${ last === i + 1 ? 'track-list-item-last' : '' }`}>
                    <span>{t.type}</span>
                    <span>{t.name}</span>
                    <span>{t.ticks}</span>
                    <span className="track-list-item-tickbar">
                        <span
                            className = "track-list-item-tickbar-bar"
                            style = {{ width: t.ticks * 2, backgroundColor: t.color }}
                        ></span>
                    </span>
                    <span
                        className = "track-list-item-buttons"
                    >
                        <span
                            className = "track-list-item-buttons-color-button"
                            style = {{ backgroundColor: t.color }}
                        ></span>
                        <span onClick={ () => deleteTrack(t.id) }>D</span>
                        <span onClick={ () => setActiveTrack(t) }>E</span>
                    </span>
                </li>
            )}
            </ul>
        </div>
    )
}

export default TrackList
