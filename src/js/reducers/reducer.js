import { combineReducers } from 'redux'
import activePattern from './activePattern'
import activePatternType from './activePatternType'
import channels from './channels'
import dragSource from './dragSource'
import fx from './fx'
import patternIsPlaying from './patterns/patternIsPlaying'
import patternRepeat from './patterns/patternRepeat'
import patterns from './patterns/patterns'
import song from './song'
import songIsPlaying from './songIsPlaying'
import songName from './songName'
import songRepeat from './songRepeat'
import status from './status'
import tick from './tick'

export default combineReducers({
    activePattern,
    activePatternType,
    channels,
    dragSource,
    fx,
    patternIsPlaying,
    patternRepeat,
    patterns,
    song,
    songIsPlaying,
    songName,
    songRepeat,
    status,
    tick
});
