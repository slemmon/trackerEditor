import { colorsObj as colors } from '../../appColors'

export default function createNewTrack (type, tracks) {
    const ticks = 8
    const myId = getNewId(tracks)
    const newTrackData = {
        ticks,
        color: getNewTrackColor(myId),
        id: myId,
        name: `Track ${myId + 1}`,
        type,
        notes: []
    }
    if ( type === 'tune' )
        for ( let x = 0; x < ticks; x++ ) {
            newTrackData.notes.push({active: -1})
        }

    return newTrackData
}

/**
 * Returns the color object (hex and rgb) from the global application colors
 * @param {Number} id The id of the track requesting color info
 * @return {Object} The colors object for the color value matching the `id`
 * passed.  Will have a `hex` key and `rgb` key with an object of `r`, `g`, and
 * `b` values
 */
function getNewTrackColor (id = 0) {
    return colors[id] || colors[0];
}

function getNewId (tracks) {
    let counter = 0

    for ( let i = 0, l = tracks.length; i < l; i++ ) {
        if ( counter <= tracks[i].id )
            counter = tracks[i].id + 1
    }

    return counter
}
