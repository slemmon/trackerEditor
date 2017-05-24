import { connect } from 'react-redux'
import ChannelRowView from './ChannelRowView'

const mapStateToProps = (state, props) => {
    return {
        status: state.status,
        tracks: state.tracks,
        channelTracks: state.channels[props.channel],
        fxStatus: state.fx.status
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
        },
        openFx (editorId) {
            dispatch({
                type: "FX_SET_VIEW",
                fxType: 'track',
                id: editorId
            })
        }
    }
}

const ChannelRow = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChannelRowView)

export default ChannelRow
