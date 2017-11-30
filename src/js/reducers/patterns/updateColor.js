export default function updateColor (patterns=state, {patternId, color}=action) {

    let pattern,
        patternIndex
    for ( let x = 0, l = patterns.length; x < l; x++ ) {
        pattern = patterns[x]
        if ( pattern.id === patternId ) {
            patternIndex = x
            pattern = Object.assign({}, pattern)
            break
        }
    }

    pattern.color = color

    const newPatterns = patterns.slice()
    newPatterns[patternIndex] = pattern

    return newPatterns

}
