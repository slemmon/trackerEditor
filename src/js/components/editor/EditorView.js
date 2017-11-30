import React, { Component } from 'react'
import SongEditor from './songEditor/SongEditor'
import PatternList from './patternList/PatternList'
import PatternEditor from './patternEditor/PatternEditor'
import DrumEditor from './drumEditor/DrumEditor'
import FxEditorManager from './fxEditor/FxEditorManager'

const Editor = ({activePattern}) =>
    <div>
        <SongEditor />
        <FxEditorManager />
        <PatternList />
        { activePattern.type === 'tune' ?
            <PatternEditor />
        : activePattern.type === 'drum' ?
            <DrumEditor />
            :null
        }
    </div>

export default Editor
