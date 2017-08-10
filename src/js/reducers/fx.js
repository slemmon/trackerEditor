import fxInfo from '../fxInfo'
import merge from 'lodash.merge'

const defaultState = {
    enabled: false,
    status: {
        fxType: '',
        id: 0
    },
    channel: {
        "0": {
            flags: 1048576,
            fx: {
                1048576: {val_0: 24}
            }
        },
        "1": {
            flags: 0,
            fx: {}
        },
        "2": {
            flags: 0,
            fx: {}
        },
        "3": {
            flags: 0,
            fx: {}
        }
    },
    track: {}
}

export default function fx (state = defaultState, action) {
    switch (action.type) {

        case "FX_SET_VIEW":
        return setView(state, action)

        case "FX_ADD_FX":
        return addFx(state, action)

        case "FX_INIT_TRACK_FX":
        return createTrackFx(state, action)

        case "FX_REMOVE_FX":
        return removeFx(state, action)

        case "FX_UPDATE_FX":
        return updateFx(state, action)

        case "FX_SET_DATA":
        return action.fx

        case "FX_HIDE_VIEW":
        return merge({}, state, {enabled: false})

        default: return state

    }
}

function setView (state, {fxType, id} = action) {
    if ( fxType === state.status.fxType && id === state.status.id )
        return merge({}, state, {enabled: false, status: {fxType: ''}})

    return merge({}, state, {
        enabled: true,
        status: {
            fxType,
            id
        }
    })
}

function addFx (state, {fxType, id, fx} = action) {
    const newState = merge({}, state)
    newState[fxType] = merge({}, newState[fxType])

    const update = merge({}, newState[fxType][id])

    update.flags = update.flags | fx

    const values = getFxValuesObject(fx)

    update.fx[fx] = values

    newState[fxType][id] = update

    return newState
}

function getFxValuesObject (fx) {
    const result = {}

    let fxValues = fxInfo[fx].values
    while ( fxValues-- )
        result[`val_${fxValues}`] = 0

    return result
}

function removeFx (state, {fxType, id, fx} = action) {
    const newState = merge({}, state)
    newState[fxType] = merge({}, newState[fxType])

    const update = merge({}, state[fxType][id])

    update.flags = update.flags ^ fx
    delete update.fx[fx]

    newState[fxType][id] = update

    return newState
}

function updateFx (state, {fxType, id, fx, key, value} = action) {
    const newState = merge({}, state)

    newState[fxType][id].fx[fx][key] = value

    return newState
}

function createTrackFx (state, action) {
    const newState = merge({}, state)

    newState.track[action.id] = {flags: 0, fx: {}}

    return newState
}
