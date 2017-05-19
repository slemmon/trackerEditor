import { combineReducers } from 'redux'
import tracks from './tracks/tracks'
import activeTrack from './activeTrack'
import song from './song'
import channels from './channels'
import fx from './fx'
import status from './status'

export default combineReducers({
    tracks,
    activeTrack,
    song,
    channels,
    fx,
    status
});
