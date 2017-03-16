import React from 'react'
import ListOfTracks from './ListOfTracks'

const ChannelRow = ({channel, tracks, addTrackAtIndex, removeTrackAtIndex, moveTrackToIndex}) =>
    <li className="song-editor-channels-item">
        <div className="song-editor-channels-item-name">
            <span><i className={`fa fa-${ channel !== 3 ? 'music' : 'superpowers' }`} aria-hidden="true"></i></span>
            <span>{`CH ${channel}`}</span>
        </div>
        <div className="song-editor-channels-item-editor">
            <ListOfTracks
                channel={channel}
                tracks={tracks}
                addTrackAtIndex={addTrackAtIndex}
                removeTrackAtIndex={removeTrackAtIndex}
                moveTrackToIndex={moveTrackToIndex}
            />
        </div>
    </li>

export default ChannelRow
