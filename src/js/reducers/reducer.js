import { combineReducers } from 'redux'
import activePattern from './activePattern'
import activePatternType from './activePatternType'
import channels from './channels'
import fx from './fx'
import song from './song'
import songIsPlaying from './songIsPlaying'
import songName from './songName'
import songRepeat from './songRepeat'
import status from './status'
import patternIsPlaying from './patterns/patternIsPlaying'
import patternRepeat from './patterns/patternRepeat'
import patterns from './patterns/patterns'

export default combineReducers({
    activePattern,
    activePatternType,
    channels,
    fx,
    song,
    songIsPlaying,
    songName,
    songRepeat,
    status,
    patternIsPlaying,
    patternRepeat,
    patterns
});
