import { colorsObj as colors } from '../../appColors'

export default function createNewPattern (type, patterns) {
    const ticks = 9
    const myId = getNewId(patterns)
    const newPatternData = {
        ticks,
        color: getNewPatternColor(myId),
        id: myId,
        name: `Pattern ${myId + 1}`,
        type,
        notes: []
    }
    if ( type === 'tune' )
        for ( let x = 0; x < ticks; x++ ) {
            newPatternData.notes.push({active: -1})
        }

    return newPatternData
}

/**
 * Returns the color object (hex and rgb) from the global application colors
 * @param {Number} id The id of the pattern requesting color info
 * @return {Object} The colors object for the color value matching the `id`
 * passed.  Will have a `hex` key and `rgb` key with an object of `r`, `g`, and
 * `b` values
 */
function getNewPatternColor (id = 0) {
    return colors[id] || colors[0];
}

function getNewId (patterns) {
    let counter = 0

    for ( let i = 0, l = patterns.length; i < l; i++ ) {
        if ( counter <= patterns[i].id )
            counter = patterns[i].id + 1
    }

    return counter
}
