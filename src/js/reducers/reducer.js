import { combineReducers } from 'redux'
import activeTrack from './activeTrack'
import activeTrackType from './activeTrackType'
import channels from './channels'
import fx from './fx'
import song from './song'
import songIsPlaying from './songIsPlaying'
import songName from './songName'
import songRepeat from './songRepeat'
import status from './status'
import trackIsPlaying from './tracks/trackIsPlaying'
import trackRepeat from './tracks/trackRepeat'
import tracks from './tracks/tracks'

export default combineReducers({
    activeTrack,
    activeTrackType,
    channels,
    fx,
    song,
    songIsPlaying,
    songName,
    songRepeat,
    status,
    trackIsPlaying,
    trackRepeat,
    tracks
});
