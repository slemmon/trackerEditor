import fxInfo from '../fxInfo'
import merge from 'lodash.merge'

const defaultState = {
    enabled: false,
    status: {
        fxType: '',
        id: 0
    },
    channel: [
        {
            flags: 1048576,
            fx: {
                1048576: {val_0: 25}
            }
        },
        {
            flags: 0,
            fx: {}
        },
        {
            flags: 0,
            fx: {}
        },
        {
            flags: 0,
            fx: {}
        }
    ],
    track: []
}

export default function fx (state = defaultState, action) {
    switch (action.type) {

        case "FX_SET_VIEW":
        return setView(state, action)

        case "FX_ADD_FX":
        return addFx(state, action)

        case "FX_REMOVE_FX":
        return removeFx(state, action)

        case "FX_UPDATE_FX":
        return updateFx(state, action)

        case "FX_SET_DATA":
        return action.fx

        case "FX_HIDE_VIEW":
        return Object.assign({}, state, {enabled: false})

        default: return state

    }
}

function setView (state, action) {
    return Object.assign({}, state, {
        enabled: true,
        status: {
            fxType: action.fxType,
            id: action.id
        }
    })
}

function addFx (state, {fxType, id, fx} = action) {
    const newState = Object.assign({}, state)
    newState[fxType] = newState[fxType].slice()

    const update = Object.assign({}, newState[fxType][id])

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
    const newState = Object.assign({}, state)
    newState[fxType] = newState[fxType].slice()

    const update = Object.assign({}, state[fxType][id])

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
