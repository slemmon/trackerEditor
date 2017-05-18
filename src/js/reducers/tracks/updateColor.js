export default function updateColor (tracks=state, {trackId, color}=action) {

    let track,
        trackIndex
    for ( let x = 0, l = tracks.length; x < l; x++ ) {
        track = tracks[x]
        if ( track.id === trackId ) {
            trackIndex = x
            track = Object.assign({}, track)
            break
        }
    }

    track.color = color

    const newTracks = tracks.slice()
    newTracks[trackIndex] = track

    return newTracks

}
