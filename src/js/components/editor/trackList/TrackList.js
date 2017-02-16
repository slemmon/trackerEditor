import React, { Component } from 'react'

const TrackList = ({tracks, createNewTrack, deleteTrack, setActiveTrack}) => {
    const last = tracks.length
    return (
        <div id="track-list-container">
            <h5>Track list</h5>
            <button className="button" onClick = { () => createNewTrack('tune') }>New tune track</button>
            <button className="button" onClick = { () => createNewTrack('drum') }>New drum track</button>
            <ul className = "track-list">
            {tracks.map( (t, i) =>
                <li key={i} className={`track-list-item ${ last === i + 1 ? 'track-list-item-last' : '' }`}>
                    <span className="track-list-item-icon"><i className="fa fa-music" aria-hidden="true"></i></span>
                    <span className="track-list-item-text">{t.name}</span>
                    <span className="track-list-item-text"><span>Ticks: </span><span>{t.ticks}</span></span>
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
                        <span onClick={ () => deleteTrack(t.id) }><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                        <span onClick={ () => setActiveTrack(t) }><i className="fa fa-pencil" aria-hidden="true"></i></span>
                    </span>
                </li>
            )}
            </ul>
        </div>
    )
}

export default TrackList
