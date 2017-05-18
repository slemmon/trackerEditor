import { combineReducers } from 'redux'
import tracks from './tracks/tracks'
import activeTrack from './activeTrack'
import song from './song'
import channels from './channels'
import fx from './fx'

export default combineReducers({
    tracks,
    activeTrack,
    song,
    channels,
    fx
});


// activetrack
// tracks
// channels
// channelfx
// trackfx
// 