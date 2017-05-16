import { combineReducers } from 'redux'
import tracks from './tracks/tracks'
import activeTrack from './activeTrack'
import channels from './channels'
import fx from './fx'

export default combineReducers({
    tracks,
    activeTrack,
    channels,
    fx
});


// activetrack
// tracks
// channels
// channelfx
// trackfx
// 