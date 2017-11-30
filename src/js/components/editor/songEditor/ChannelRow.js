import { connect } from 'react-redux'
import ChannelRowView from './ChannelRowView'

const mapStateToProps = (state, props) => {
    return {
        status: state.status,
        patterns: state.patterns,
        channelPatterns: state.channels[props.channel],
        fxStatus: state.fx.status,
        fx: state.fx
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
