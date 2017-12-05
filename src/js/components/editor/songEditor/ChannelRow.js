import { connect } from 'react-redux'
import ChannelRowView from './ChannelRowView'

const mapStateToProps = (state, props) => {
    const { channels, dragSource, fx, patterns, status, tick } = state
    const { channel } = props

    return {
        channelPatterns: channels[channel],
        dragSource: dragSource,
        fx: fx,
        fxStatus: fx.status,
        patterns: patterns,
        status: status,
        tick: tick
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addPatternAtIndex (channel, pattern, position) {
            dispatch({
                type: "CHANNEL_ADD_PATTERN",
                pattern,
                position,
                channel
            })
        },
        movePatternToIndex (toChannel, fromChannel, editorId, position) {
            dispatch({
                type: "CHANNEL_MOVE_PATTERN",
                editorId,
                position,
                toChannel,
                fromChannel
            })
        },
        removePattern (channel, editorId) {
            dispatch({
                type: "CHANNEL_REMOVE_PATTERN",
                editorId,
                channel
            })
        },
        openFx (editorId) {
            dispatch({
                type: "FX_SET_VIEW",
                fxType: 'pattern',
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
