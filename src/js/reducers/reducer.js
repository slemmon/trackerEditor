import { combineReducers } from 'redux'
import tracks from './tracks/tracks'
import activeTrack from './activeTrack'
import player from './player'

export default combineReducers({
    tracks,
    activeTrack,
    player
});


// activetrack
// tracks
// channels
// channelfx
// trackfx
// 