const defaultState = 0

export default function tick (state = defaultState, action) {
    switch (action.type) {

        case 'SET_TICK': return action.tick

        default: return state
    }
}
