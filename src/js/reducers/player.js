// const defaultState = {
//     muted: false,
//     autoplay: false,
//     song: [],
//     playOnce: false
// }

// export default function player (state = defaultState, action) {
//     switch (action.type) {
//         case 'PLAYER_SET_SONG': return Object.assign({}, state, {song: action.song})

//         case 'PLAYER_TOGGLE_MUTE': return Object.assign({}, state, {muted: !state.muted})

//         case 'PLAYER_TOGGLE_AUTOPLAY': return Object.assign({}, state, {autoplay: !state.autoplay})

//         case 'PLAYER_PLAY_ONCE': return Object.assign({}, state, {playOnce: true})

//         default: return state
//     }
// }
