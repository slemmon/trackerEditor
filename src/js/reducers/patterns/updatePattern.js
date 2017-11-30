export default function updatePattern (patterns=state, {patternId, pattern}=action) {

    let patternIndex
    for ( let x = 0, l = patterns.length; x < l; x++ ) {
        if ( patterns[x].id === patternId ) {
            patternIndex = x
            break
        }
    }

    const newPatterns = patterns.slice()
    newPatterns[patternIndex] = pattern

    return newPatterns

}
