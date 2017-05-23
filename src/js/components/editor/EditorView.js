import React, { Component } from 'react'
import SongEditor from './songEditor/SongEditor'
import TrackList from './trackList/TrackList'
import TrackEditor from './trackEditor/TrackEditor'
import DrumEditor from './drumEditor/DrumEditor'
import FxEditorManager from './fxEditor/FxEditorManager'

const Editor = ({activeTrack}) =>
    <div>
        <SongEditor />
        <FxEditorManager />
        <TrackList />
        { activeTrack.type === 'tune' ?
            <TrackEditor />
        : activeTrack.type === 'drum' ?
            <DrumEditor />
            :null
        }
    </div>

export default Editor
