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

    let tracksHex = tracksLength.toString(16)
    if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
    let song = [
        `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
    ]
    let nextTrackAddress = 0

    song = song.concat(new Array(tracksLength/* * 2*/))
    song = song.concat([null, null, null, null])

    let drumTrackNumbers

    tracks.forEach((track, i) => {
        let converted

        if ( track.channel === 3 ) {
            drumTrackNumbers = getDrumTrackNumbers(tracksLength, track)
            converted = convertDrumTrack(track, drumTrackNumbers)
            
        } else {
            converted = convertTrack(track)                  // get array from track notes

            converted.noteSequence.unshift(`$$$0x40, ${63},\t\t\t// FX: SET VOLUME: volume = ${63}$$$`)
            // converted.noteSequence.unshift(63)                          // volume value
            // converted.noteSequence.unshift(64)                          // set volume
            converted.trackBytes += 2
        }


        let nextTrackAddressHex = nextTrackAddress.toString(16)
        if ( nextTrackAddressHex.length < 2 ) nextTrackAddressHex = `0${nextTrackAddressHex}`
        song[(i/**2*/)+1] = `$$$0x${nextTrackAddressHex}, 0x00,\t\t\t// Address of track ${i}$$$`                            // Address of this track
        // song[(i*2)+1] = nextTrackAddress                            // Address of this track
        // song[(i*2)+2] = 0                                           // Address of this track pt2


        if ( i === 0 ) {                                            // add tempo if this is the first track
            converted.noteSequence.unshift(`$$$0x9D, ${50},\t\t\t// SET song tempo: value = ${50}$$$`)
            // converted.noteSequence.unshift(50)                      // tempo value
            // converted.noteSequence.unshift(157)                     // set tempo
            converted.trackBytes += 2
        }

        song = song.concat("Track", converted.noteSequence)         // add array to song
        nextTrackAddress = nextTrackAddress + converted.trackBytes  // calculate what the address of the next track will be

        let indexHex = i.toString(16)
        if ( indexHex.length < 2 ) indexHex = `0${indexHex}`
        song[ 1 + (tracksLength /** 2*/) + ( track.channel ) ] = `$$$0x${indexHex},\t\t\t// Channel ${track.channel} entry track$$$`
        // song[ 1 + (tracksLength * 2) + ( track.channel ) ] = i  // set starting track for the channel this track should be played on
    })

    if ( drumTrackNumbers ) {                                       // add drumtracks
        song = addRequiredDrumTracks(song, drumTrackNumbers)
    }

    if ( tracksLength < 4 ) {                                       // add silent track for all remaining unused channels
        song = addTrackAddress(song)

        const tracksNumber = parseInt(song[0].slice(5, 7), 16) + 1

        let tracksHex = tracksNumber.toString(16)
        if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
        song[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
        song = song.concat([
            "Track",
            "$$$0x40, 0,\t\t\t// FX: SET VOLUME: volume = 0$$$",
            "$$$0x9F,\t\t\t// FX: STOP CURRENT CHANNEL$$$"
        ])
        const lastTrackAddress = tracksNumber/* * 2*/ + 1 + 4
        for ( let x = 1; x < lastTrackAddress; x++ ) {
            if ( song[x] === null ) {
                let modifiedTracksLengthHex = (tracksNumber - 1).toString(16)
                if ( modifiedTracksLengthHex.length < 2 ) modifiedTracksLengthHex = `0${modifiedTracksLengthHex}`
                song[x] = `$$$0x${modifiedTracksLengthHex},\t\t\t// Channel ${x - tracksNumber/**2*/ - 1} entry track$$$`
                // song[x] = tracksNumber - 1
            }
        }
    }

    let songString = JSON.stringify(song, null, 4)
    songString = songString.replace('[\n', '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n')
    songString = songString.replace(/"Track"/ig, '//"Track"')
    songString = songString.replace('CHANNEL$$$"\n]', 'CHANNEL\n};\n\n\n\n#endif\n')
    songString = songString.replace('RETURN$$$"\n]', 'RETURN\n};\n\n\n\n#endif\n')

    songString = songString.replace(/"?\$\$\$(",)?/g, '')
    songString = songString.replace(/\\t/g, '\t')

    return {
        song,
        songString
    }
}

function convertTrack (track) {
    const notes = track.notes
    const noteSequence = createNoteSequenceWithComments(notes)
    noteSequence.push("$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$")             // volume slide off
    noteSequence.push("$$$0x9F,\t\t\t// FX: STOP CURRENT CHANNEL$$$")         // stop channel
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
        skip = 0,
        lastDelayTotal
    for ( let x = 0, l = track.ticks; x < l; x++ ) {
        note = notes[x]
        if ( note === undefined && skip-- < 1 ) {
            if ( wasEmpty ) {
                lastDelayTotal++
                noteSequence[noteSequence.length - 1] = `$$$0x9F + ${lastDelayTotal},\t\t\t// DELAY: ticks = ${lastDelayTotal}$$$`
            } else {
                wasEmpty = true
                noteSequence.push(`$$$0x00 + 0,\t\t\t// NOTE ON: note = 0$$$`)
                noteSequence.push(`$$$0x9F + 1,\t\t\t// DELAY: ticks = 1$$$`)
                lastDelayTotal = 1
            }
        } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
            skip = note === 'snare' ? 1 : note === 'shake' ? 3 : 15
            wasEmpty = false
            noteSequence.push(`$$$0xFC, ${drumTrackNumbers[note]},\t\t\t// GOTO track ${drumTrackNumbers[note]}$$$`)
        }
    }
    noteSequence.push("$$$0x9F,\t\t\t// FX: STOP CURRENT CHANNEL$$$")
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
    let tracks = parseInt(song[0].slice(5, 7), 16)
    if ( drumTrackNumbers.snare ) {
        newSong = addTrackAddress(newSong)                              // add track address
        newSong = [].concat(newSong, [                                  // add snare track
            "Track",
            "$$$0x40, 32,\t\t\t// FX: SET VOLUME: volume = 32$$$",
            "$$$0x41, -16,\t\t\t// FX: VOLUME SLIDE ON: steps = -16$$$",
            "$$$0x9F + 2,\t\t\t// DELAY: ticks = 2$$$",
            "$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$",
            "$$$0xFE,\t\t\t// RETURN$$$"
        ])
        tracks++
        let tracksHex = tracks.toString(16)
        if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
        newSong[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
    }
    if ( drumTrackNumbers.shake ) {
        newSong = addTrackAddress(newSong)                              // add track address
        newSong = [].concat(newSong, [                                  // add shake track
            "Track",
            "$$$0x49, 4 + 0,\t\t// FX: RETRIG NOISE: point = 1 (*4) / speed = 0 (fastest)$$$",
            "$$$0x40, 32,\t\t\t// FX: SET VOLUME: volume = 32$$$",
            "$$$0x41, -8,\t\t\t// FX: VOLUME SLIDE ON: steps = -8$$$",
            "$$$0x9F + 4,\t\t\t// DELAY: ticks = 4$$$",
            "$$$0x4A,\t\t\t// FX: RETRIG: off$$$",
            "$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$",
            "$$$0xFE,\t\t\t// RETURN$$$"
        ])
        tracks++
        let tracksHex = tracks.toString(16)
        if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
        newSong[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
    }
    if ( drumTrackNumbers.crash ) {
        newSong = addTrackAddress(newSong)                              // add track address
        newSong = [].concat(newSong, [                                  // add crash track
            "Track",
            "$$$0x40, 32,\t\t\t// FX: SET VOLUME: volume = 32$$$",
            "$$$0x41, -2,\t\t\t// FX: VOLUME SLIDE ON: steps = -2$$$",
            "$$$0x9F + 16,\t\t\t// DELAY: ticks = 16$$$",
            "$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$",
            "$$$0xFE,\t\t\t// RETURN$$$"
        ])
        tracks++
        let tracksHex = tracks.toString(16)
        if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
        newSong[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
    }
    return newSong
}

function addTrackAddress (song) {
    const tracks = parseInt(song[0].slice(5, 7), 16)
    const afterLastTrackIndex = tracks/* * 2*/ + 1

    const reversedSong = song.slice().reverse()
    let lastTrackReversed = ''
    for ( let x = 0; x >= 0; x++ ) {
        if ( reversedSong[x] === 'Track' )
            break
        lastTrackReversed += reversedSong[x]
    }
    const lastTrackLength = lastTrackReversed.split(',').length - 1

    let lastTrackBytes = parseInt(song[afterLastTrackIndex - 1].slice(5, 7), 16) + lastTrackLength
    lastTrackBytes = lastTrackBytes.toString(16)
    if ( lastTrackBytes.length < 2 ) lastTrackBytes = `0${lastTrackBytes}`
    const address = `$$$0x${lastTrackBytes}, 0x00,\t\t\t// Address of track ${tracks}$$$`
    const result = [].concat(song.slice(0, afterLastTrackIndex), address, song.slice(afterLastTrackIndex)) // add track address to song
    return result
}

function createNoteSequence (notes) {
    const noteSequence = []

    let thisNote,
        lastNote = -1,
        thisNoteNumber

    for ( const note of notes ) {
        thisNote = (note||{}).active
        thisNoteNumber = ~thisNote ? thisNote : 0
        if ( thisNote === lastNote ) {
            if ( !noteSequence.length ) {
                noteSequence[0] = thisNoteNumber
                noteSequence[1] = 159 + 1
            } else
                noteSequence[noteSequence.length - 1]++
        } else {
            noteSequence.push(thisNoteNumber) // note to play
            noteSequence.push(159 + 1)  // play for 1 tick
        }
        lastNote = thisNote
    }

    return noteSequence
}

function createNoteSequenceWithComments (notes) {
    const noteSequence = []

    let thisNote,
        lastNote = -1,
        thisNoteNumber,
        lastDelayTotal

    for ( const note of notes ) {
        thisNote = (note||{}).active
        thisNoteNumber = ~thisNote ? thisNote : 0
        if ( thisNote === lastNote ) {
            if ( !noteSequence.length ) {
                noteSequence[0] = `$$$0x00 + ${thisNoteNumber},\t\t\t// NOTE ON: note = ${thisNoteNumber}$$$`
                noteSequence[1] = '$$$0x9F + 1,\t\t\t// DELAY: ticks = 1$$$'
                lastDelayTotal = 1
            } else {
                const lastDelay = noteSequence[noteSequence.length - 1]
                lastDelayTotal++
                noteSequence[noteSequence.length - 1] = `$$$0x9F + ${lastDelayTotal},\t\t\t// DELAY: ticks = ${lastDelayTotal}$$$`
            }
        } else {
            noteSequence.push(`$$$0x00 + ${thisNoteNumber},\t\t\t// NOTE ON: note = ${thisNoteNumber}$$$`)   // note to play
            noteSequence.push('$$$0x9F + 1,\t\t\t// DELAY: ticks = 1$$$')                         // play for 1 tick
            lastDelayTotal = 1
        }
        lastNote = thisNote
    }

    return noteSequence
}
