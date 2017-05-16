import { combineReducers } from 'redux'
import tracks from './tracks/tracks'
import activeTrack from './activeTrack'
import channels from './channels'

export default combineReducers({
    tracks,
    activeTrack,
    channels,
});


// activetrack
// tracks
// channels
// channelfx
// trackfx
// 