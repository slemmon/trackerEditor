const defaultState = 0

// 0: 'idle'
// 1: 'loading file'

export default function status (state = defaultState, action) {
    switch (action.type) {

        case 'STATUS_SET':
        return action.status

        default: return state
    }
}
