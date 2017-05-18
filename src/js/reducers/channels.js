const defaultState = [
[],[],[],[]
]

let editorIdCounter = 0

export default function song (state = defaultState, action) {
    switch (action.type) {

        case 'CHANNEL_ADD_TRACK':
        return addTrack(state, action)

        case 'CHANNEL_MOVE_TRACK':
        return moveTrack(state, action)

        case 'CHANNEL_REMOVE_TRACK':
        return removeTrack(state, action)

        case 'CHANNEL_REMOVE_TRACKS_BY_ID':
        return removeTracksById(state, action)

        case 'CHANNEL_SET_DATA':
        return action.channels

        default: return state
    }
}

// function addTrack (state, action) {
function addTrack (state, {channel, track, position}=action) {

    const channels = state.slice()
    const tracks = channels[channel]
    const pos = ~position ? position : tracks.length
    const newTrack = Object.assign({}, track, {editorId: editorIdCounter++})
    const newTracks = [].concat( tracks.slice(0, pos), newTrack, tracks.slice(pos) )
    channels[channel] = newTracks

    return channels

}

function moveTrack (state, {fromChannel, toChannel, editorId, position}=action) {
    const channels = state.slice()

    const toChannelTracks = channels[toChannel]
    const fromChannelTracks = channels[fromChannel]
    const track = fromChannelTracks.find( t => t.editorId === editorId )

    const newChannelTracks = []
    const pos = ~position ? position : toChannelTracks.length
    for ( let i = 0, l = toChannelTracks.length; i < l; i++ ) {
        if ( i === pos )
            newChannelTracks.push(track)
        if ( toChannelTracks[i].editorId !== editorId )
            newChannelTracks.push(toChannelTracks[i])
    }
    if ( pos === toChannelTracks.length )
        newChannelTracks.push(track)

    channels[toChannel] = newChannelTracks

    if ( fromChannel !== toChannel )
        channels[fromChannel] = channels[fromChannel].filter( t => t.editorId !== editorId)

    return channels
}

function removeTrack (state, {channel, editorId}=action) {
    const channels = state.slice()

    channels[channel] = channels[channel].filter( t => t.editorId !== editorId )

    return channels
}

function removeTracksById (state, {trackId}=action) {
    const channels = state.slice()

    for ( let i = 4; i-- > 0; )
        channels[i] = channels[i].filter( t => t.id !== trackId )

    return channels
}
