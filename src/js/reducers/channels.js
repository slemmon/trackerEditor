const defaultState = [
[],[],[],[]
]

let editorIdCounter = 0

export default function song (state = defaultState, action) {
    switch (action.type) {

        case 'CHANNEL_ADD_PATTERN':
        return addPattern(state, action)

        case 'CHANNEL_MOVE_PATTERN':
        return movePattern(state, action)

        case 'CHANNEL_REMOVE_PATTERN':
        return removePattern(state, action)

        case 'CHANNEL_REMOVE_PATTERNS_BY_ID':
        return removePatternsById(state, action)

        case 'CHANNEL_SET_DATA':
        return action.channels

        default: return state
    }
}

// function addPattern (state, action) {
function addPattern (state, {channel, pattern, position}=action) {

    const channels = state.slice()
    const patterns = channels[channel]
    const pos = ~position ? position : patterns.length
    const newPattern = Object.assign({}, pattern, {editorId: editorIdCounter++})
    const newPatterns = [].concat( patterns.slice(0, pos), newPattern, patterns.slice(pos) )
    channels[channel] = newPatterns

    return channels

}

function movePattern (state, {fromChannel, toChannel, editorId, position}=action) {
    const channels = state.slice()

    const toChannelPatterns = channels[toChannel]
    const fromChannelPatterns = channels[fromChannel]
    const pattern = fromChannelPatterns.find( t => t.editorId === editorId )

    const newChannelPatterns = []
    const pos = ~position ? position : toChannelPatterns.length
    for ( let i = 0, l = toChannelPatterns.length; i < l; i++ ) {
        if ( i === pos )
            newChannelPatterns.push(pattern)
        if ( toChannelPatterns[i].editorId !== editorId )
            newChannelPatterns.push(toChannelPatterns[i])
    }
    if ( pos === toChannelPatterns.length )
        newChannelPatterns.push(pattern)

    channels[toChannel] = newChannelPatterns

    if ( fromChannel !== toChannel )
        channels[fromChannel] = channels[fromChannel].filter( t => t.editorId !== editorId)

    return channels
}

function removePattern (state, {channel, editorId}=action) {
    const channels = state.slice()

    channels[channel] = channels[channel].filter( t => t.editorId !== editorId )

    return channels
}

function removePatternsById (state, {patternId}=action) {
    const channels = state.slice()

    for ( let i = 4; i-- > 0; )
        channels[i] = channels[i].filter( t => t.id !== patternId )

    return channels
}
