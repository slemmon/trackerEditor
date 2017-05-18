import { connect } from 'react-redux'
import ChannelRowView from './ChannelRowView'

const mapStateToProps = (state, props) => {
    return {
        tracks: state.tracks,
        channelTracks: state.channels[props.channel]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTrackAtIndex (channel, track, position) {
            dispatch({
                type: "CHANNEL_ADD_TRACK",
                track,
                position,
                channel
            })
        },
        moveTrackToIndex (toChannel, fromChannel, editorId, position) {
            dispatch({
                type: "CHANNEL_MOVE_TRACK",
                editorId,
                position,
                toChannel,
                fromChannel
            })
        },
        removeTrack (channel, editorId) {
            dispatch({
                type: "CHANNEL_REMOVE_TRACK",
                editorId,
                channel
            })
        }
    }
}

const ChannelRow = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelRowView)

export default ChannelRow
