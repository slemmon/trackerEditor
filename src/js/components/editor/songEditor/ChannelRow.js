import React from 'react'
import ListOfTracks from './ListOfTracks'

const ChannelRow = ({channel, tracks, addTrackAtIndex, removeTrackAtIndex, moveTrackToIndex}) =>
    <div className="channel-track">
        <ListOfTracks
            channel={channel}
            tracks={tracks}
            addTrackAtIndex={addTrackAtIndex}
            removeTrackAtIndex={removeTrackAtIndex}
            moveTrackToIndex={moveTrackToIndex}
        />
    </div>

export default ChannelRow
