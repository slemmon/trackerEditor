export default function updateTrack (tracks=state, {trackId, track}=action) {

    let trackIndex
    for ( let x = 0, l = tracks.length; x < l; x++ ) {
        if ( tracks[x].id === trackId ) {
            trackIndex = x
            break
        }
    }

    const newTracks = tracks.slice()
    newTracks[trackIndex] = track

    return newTracks

}
