import React, { Component } from 'react'
import SongEditor from './songEditor/SongEditor'
import TrackList from './trackList/TrackList'
import TrackEditor from './trackEditor/TrackEditor'
import DrumEditor from './drumEditor/DrumEditor'
import FxEditor from './fxEditor/FxEditor'

const Editor = ({activeTrack}) =>
    <div>
        <SongEditor />
        <TrackList />
        { activeTrack.type === 'tune' ?
            <TrackEditor />
        : activeTrack.type === 'drum' ?
            <DrumEditor />
            :null
        }
        <FxEditor />
    </div>

export default Editor
