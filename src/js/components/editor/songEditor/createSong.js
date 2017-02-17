export default createSong
export { createNoteSequence }

function createSong (tracks) {
    const tracksLength = tracks.length

    if ( !tracksLength ) {
        return {
            song: [],
            songString: ''
        }
    }

    let song = [
        tracksLength
    ]
    let nextTrackAddress = 0

    song = song.concat(new Array(tracksLength * 2))
    song = song.concat([null, null, null, null])

    let drumTrackNumbers

    tracks.forEach((track, i) => {
        let converted

        if ( track.channel === 4 ) {
            drumTrackNumbers = getDrumTrackNumbers(tracksLength, track)
            converted = convertDrumTrack(track, drumTrackNumbers)
            
        } else {
            converted = convertTrack(track)                  // get array from track notes

            converted.noteSequence.unshift(63)                          // volume value
            converted.noteSequence.unshift(64)                          // set volume
            converted.trackBytes += 2
        }


        song[(i*2)+1] = nextTrackAddress                            // Address of this track
        song[(i*2)+2] = 0                                           // Address of this track pt2


        if ( i === 0 ) {                                            // add tempo if this is the first track
            converted.noteSequence.unshift(50)                      // tempo value
            converted.noteSequence.unshift(157)                     // set tempo
            converted.trackBytes += 2
        }

        song = song.concat("Track", converted.noteSequence)         // add array to song
        nextTrackAddress = nextTrackAddress + converted.trackBytes  // calculate what the address of the next track will be

        song[ 1 + (tracksLength * 2) + ( track.channel - 1 ) ] = i  // set starting track for the channel this track should be played on
    })

    if ( drumTrackNumbers ) {                                       // add drumtracks
        song = addRequiredDrumTracks(song, drumTrackNumbers)
    }

    if ( tracksLength < 4 ) {                                       // add silent track for all remaining unused channels
        song = addTrackAddress(song)
        song[0] = song[0] + 1
        song = song.concat([
            "Track",
            64,
            0,
            159
        ])
        const lastTrackAddress = song[0] * 2 + 1 + 4
        for ( let x = 1; x < lastTrackAddress; x++ ) {
            if ( song[x] === null )
                song[x] = song[0] - 1
        }
    }

    let songString = JSON.stringify(song, null, 4)
    songString = songString.replace('[\n', '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n')
    songString = songString.replace(/"Track"/ig, '//"Track"')
    songString = songString.replace('159\n]', '159,\n};\n\n\n\n#endif\n')
    songString = songString.replace('254\n]', '254,\n};\n\n\n\n#endif\n')

    return {
        song,
        songString
    }
}

function convertTrack (track) {
    const notes = track.notes
    const noteSequence = createNoteSequence(notes)
    noteSequence.push(0x43)                                          // volume slide off
    noteSequence.push(159)                                          // stop channel
    const trackBytes = noteSequence.length
    return {
        noteSequence,
        trackBytes
    }
}

function convertDrumTrack (track, drumTrackNumbers) {
    const notes = track.notes
    let note,
        noteSequence = [],
        wasEmpty = false,
        skip = 0
    for ( let x = 0, l = track.ticks; x < l; x++ ) {
        note = notes[x]
        if ( note === undefined && skip-- < 1 ) {
            if ( wasEmpty )
                noteSequence[noteSequence.length - 1]++
            else {
                wasEmpty = true
                noteSequence.push(0)
                noteSequence.push(160)
            }
        } else if ( note !== undefined ) {
            skip = note === 'snare' ? 1 : note === 'shake' ? 3 : 15
            wasEmpty = false
            noteSequence = noteSequence.concat([0xFC, drumTrackNumbers[note]])
        }
    }
    noteSequence.push(159)
    return {
        noteSequence,
        trackBytes: noteSequence.length
    }
}

function getDrumTrackNumbers (tracks, track) {
    let counter = tracks
    const notes = track.notes
    const trackNumbers = {
        snare: null,
        shake: null,
        crash: null
    }
    for ( const note of notes ) {
        switch (note) {
            case 'snare':
            if ( !trackNumbers.snare ) trackNumbers.snare = counter++
            break

            case 'shake':
            if ( !trackNumbers.shake ) trackNumbers.shake = counter++
            break

            case 'crash':
            if ( !trackNumbers.crash ) trackNumbers.crash = counter++
            break
        }
    }
    return trackNumbers
}

function addRequiredDrumTracks (song, drumTrackNumbers) {
    let newSong = song.slice()
    if ( drumTrackNumbers.snare ) {
        newSong = addTrackAddress(newSong)                                                       // add track address
        newSong = [].concat(newSong, ["Track", 0x40, 32, 0x41, -16, 0x9F + 2, 0x43, 0xFE])                     // add snare track
        newSong[0]++
    }
    if ( drumTrackNumbers.shake ) {
        newSong = addTrackAddress(newSong)                                                       // add track address
        newSong = [].concat(newSong, ["Track", 0x49, 4 + 0, 0x40, 32, 0x41, -8, 0x9F + 4, 0x4A, 0x43, 0xFE])   // add shake track
        newSong[0]++
    }
    if ( drumTrackNumbers.crash ) {
        newSong = addTrackAddress(newSong)                                                       // add track address
        newSong = [].concat(newSong, ["Track", 0x40, 32, 0x41, -2, 0x9F + 16, 0x43, 0xFE])                     // add crash track
        newSong[0]++
    }
    return newSong
}

function addTrackAddress (song) {
    const tracks = song[0]
    const afterLastTrackIndex = tracks * 2 + 1

    const reversedSong = song.slice().reverse()
    const lastTrackReversed = []
    for ( let x = 0; x >= 0; x++ ) {
        if ( reversedSong[x] === 'Track' )
            break
        lastTrackReversed.push(reversedSong[x])
    }
    const lastTrackLength = lastTrackReversed.length

    const result = [].concat(song.slice(0, afterLastTrackIndex), [lastTrackLength + ( song[afterLastTrackIndex - 2] ) , 0], song.slice(afterLastTrackIndex)) // add track address to song
    return result
}

function createNoteSequence (notes) {
    const noteSequence = []

    let thisNote,
        lastNote = -1

    for ( const note of notes ) {
        thisNote = (note||{}).active
        if ( thisNote === lastNote ) {
            if ( !noteSequence.length ) {
                noteSequence[0] = ~thisNote ? thisNote : 0
                noteSequence[1] = 159 + 1
            } else
                noteSequence[noteSequence.length - 1]++
        } else {
            noteSequence.push(~thisNote ? thisNote : 0) // note to play
            noteSequence.push(159 + 1)  // play for 1 tick
        }
        lastNote = thisNote
    }

    return noteSequence
}
