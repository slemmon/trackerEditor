import React, { Component } from 'react'

const TrackList = ({tracks, createNewTrack, deleteTrack, setActiveTrack}) => {
    const last = tracks.length
    return (
        <div id="track-list-container">
            <h5>Track list</h5>
            <button className="button" onClick = { () => createNewTrack('tune') }>New tune track</button>
            <button className="button" onClick = { () => createNewTrack('drum') }>New drum track</button>
            <ul className = "track-list">
            {tracks.map( (track, i) =>
                <TrackRow
                    key = {i}
                    index = {i}
                    last = {last}
                    track = {track}
                    deleteTrack = {deleteTrack}
                    setActiveTrack = {setActiveTrack}
                />
            )}
            </ul>
        </div>
    )
}

export default TrackList

const TrackRow = ({last, i, track, deleteTrack, setActiveTrack}) =>
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
                    <span
                        className = "track-list-item-buttons-color-button"
                        style = {{ backgroundColor: track.color }}
                    ></span>
                    <span onClick={ () => deleteTrack(track.id) }><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    <span onClick={ () => setActiveTrack(track) }><i className="fa fa-pencil" aria-hidden="true"></i></span>
                </span>
            </li>
//         )
//     }
// }
