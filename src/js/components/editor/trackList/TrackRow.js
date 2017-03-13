import React from 'react'
import Color from './Color'
import stringifyColor from '../../../stringifyColor'

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
                style = {{ width: track.ticks * 2, backgroundColor: stringifyColor(track.color, 'rgba', {a: 0.5}), borderColor: stringifyColor(track.color, 'rgb') }}
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

export default TrackRow
