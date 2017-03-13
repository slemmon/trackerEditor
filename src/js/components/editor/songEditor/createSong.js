// export default createSong
export { createNoteSequence, createSongFromChannels }

const drumTracks = {
    snare: {
        notes: [
            "//\"Track snare\"",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x41, -16,\t\t// FX: VOLUME SLIDE ON: steps = -16",
            "0x9F + 2,\t\t// DELAY: ticks = 2",
            "0x43,\t\t\t// FX: VOLUME SLIDE OFF",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 7
    },
    shake: {
        notes: [
            "//\"Track shake\"",
            "0x49, 4 + 0,\t\t// FX: RETRIG NOISE: point = 1 (*4) / speed = 0 (fastest)",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x41, -8,\t\t// FX: VOLUME SLIDE ON: steps = -8",
            "0x9F + 4,\t\t// DELAY: ticks = 4",
            "0x4A,\t\t\t// FX: RETRIG: off",
            "0x43,\t\t\t// FX: VOLUME SLIDE OFF",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 10
    },
    crash: {
        notes: [
            "//\"Track crash\"",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x41, -2,\t\t// FX: VOLUME SLIDE ON: steps = -2",
            "0x9F + 16,\t\t// DELAY: ticks = 16",
            "0x43,\t\t\t// FX: VOLUME SLIDE OFF",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 7
    }
}

function createSongFromChannels (tracks, channels) {

    const trackAtm = {}
    let totalTracks = 0

    const requiredDrumTracks = getRequiredDrumTracks(tracks)
    for ( const key in requiredDrumTracks ) {
        if ( requiredDrumTracks[key] !== false ) {
            totalTracks++
            trackAtm[key] = {
                track: {},
                index: totalTracks - 1,
                atm: drumTracks[key]
            }
        }
    }

    let track
    for ( let x = 0, l = tracks.length; x < l; x++ ) {
        track = tracks[x]
        totalTracks++
        trackAtm[track.id] = {
            track,
            index: totalTracks - 1,
            atm: atmifyTrack(requiredDrumTracks, track)
        }
    }

    const channelTracks = []
    for ( let i = 0; i < 4; i++ )
        channelTracks.push(atmifyChannel(trackAtm, channels[i], i===0, i))

    const { trackAddresses, trackString, totalBytes } = concatAllTracks(trackAtm)
    const { channelAddresses, channelString, channelEntryTracks } = concatAllChannels(totalBytes, totalTracks, channelTracks)
    totalTracks += 4

    let completeSong = '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n'
    completeSong += `0x${hexify(totalTracks)},\t\t\t// Number of tracks\n`
    completeSong += trackAddresses
    completeSong += channelAddresses
    completeSong += channelEntryTracks
    completeSong += trackString
    completeSong += channelString
    completeSong += '\n};\n\n\n\n#endif\n'

    return completeSong

}

function atmifyChannel (tracks, channel, addTempo, index) {
    const channelTrack = []
    let totalBytes = 0
    if ( addTempo ) {
        channelTrack.push('0x9D, 50,\t\t// SET song tempo: value = 50')                                     // add song tempo
        totalBytes += 2
    }

    channelTrack.push(`0x40, ${48},\t\t// FX: SET VOLUME: volume = ${48}`)
    totalBytes += 2

    for ( const track of channel ) {
        channelTrack.push(`0xFC, ${tracks[track.id].index},\t\t// GOTO track ${tracks[track.id].index}`)    // goto track
        totalBytes += 2
    }

    channelTrack.push(`0x00 + 0,\t\t// NOTE ON: note = 0`)
    totalBytes++

    channelTrack.push('0x9F,\t\t\t// FX: STOP CURRENT CHANNEL')                                             // end of channel
    totalBytes++

    channelTrack.unshift(`//\"Track channel ${index}\"`)

    return { notes: channelTrack, bytes: totalBytes }
}

function atmifyTrack (requiredDrumTracks, track) {
    if ( track.type === 'tune' )
        return atmifyRegularTrack(track)
    else
        return atmifyDrumTrack(requiredDrumTracks, track)
}

function atmifyRegularTrack (track) {
    const notes = track.notes
    const noteSequence = []

    let thisNote,
        lastNote = -1,
        thisNoteNumber,
        lastDelayTotal,
        totalBytes = 0

    for ( const note of notes ) {
        thisNote = (note||{}).active
        thisNoteNumber = ~thisNote ? thisNote : 0
        if ( thisNote === lastNote ) {
            if ( !noteSequence.length ) {
                noteSequence[0] = `0x00 + ${thisNoteNumber},\t\t// NOTE ON: note = ${thisNoteNumber}`
                noteSequence[1] = '0x9F + 1,\t\t// DELAY: ticks = 1'
                lastDelayTotal = 1
                totalBytes = 2
            } else {
                const lastDelay = noteSequence[noteSequence.length - 1]
                lastDelayTotal++
                noteSequence[noteSequence.length - 1] = `0x9F + ${lastDelayTotal},\t\t// DELAY: ticks = ${lastDelayTotal}`
            }
        } else {
            noteSequence.push(`0x00 + ${thisNoteNumber},\t\t// NOTE ON: note = ${thisNoteNumber}`)  // note to play
            noteSequence.push('0x9F + 1,\t\t// DELAY: ticks = 1')                                   // play for 1 tick
            lastDelayTotal = 1
            totalBytes += 2
        }
        lastNote = thisNote
    }

    noteSequence.push('0xFE,\t\t\t// RETURN')                 // end of track (RETURN)
    totalBytes++

    noteSequence.unshift(`//\"Track ${track.name}\"`)

    return { notes: noteSequence, bytes: totalBytes }
}

function atmifyDrumTrack (drumTrackNumbers, track) {
    const notes = track.notes

    let note,
        noteSequence = [],
        wasEmpty = false,
        skip = 0,
        lastDelayTotal,
        totalBytes = 0

    for ( let x = 0, l = track.ticks; x < l; x++ ) {
        note = notes[x]
        if ( note === undefined && skip-- < 1 ) {
            if ( wasEmpty ) {
                lastDelayTotal++
                noteSequence[noteSequence.length - 1] = `0x9F + ${lastDelayTotal},\t\t// DELAY: ticks = ${lastDelayTotal}`
                totalBytes++
            } else {
                wasEmpty = true
                noteSequence.push(`0x00 + 0,\t\t// NOTE ON: note = 0`)
                noteSequence.push(`0x9F + 1,\t\t// DELAY: ticks = 1`)
                lastDelayTotal = 1
                totalBytes += 2
            }
        } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
            skip = note === 'snare' ? 1 : note === 'shake' ? 3 : 15
            wasEmpty = false
            noteSequence.push(`0xFC, ${drumTrackNumbers[note]},\t\t// GOTO track ${drumTrackNumbers[note]}`)
            totalBytes += 2
        }
    }

    noteSequence.push('0xFE,\t\t\t// RETURN')                 // end of track (RETURN)
    totalBytes++

    noteSequence.unshift(`//\"Track ${track.name}\"`)

    return {
        notes: noteSequence,
        bytes: totalBytes
    }
}

function getRequiredDrumTracks (tracks) {
    const required = []
    let counter = 0
    let snare = false
    let shake = false
    let crash = false
    for ( const track of tracks ) {
        if ( counter === 3 ) break
        const notes = track.notes
        for ( const note of notes ) {
            switch (note) {
                case 'snare':
                snare = 0
                counter++
                break

                case 'shake':
                shake = snare !== false ? 1 : 0
                counter++
                break

                case 'crash':
                crash = shake !== false ? shake + 1 : (snare !== false ? 1 : 0)
                counter++
                break
            }
        }
    }
    return { snare, shake, crash }
}

function concatAllTracks (tracks) {
    let trackAddresses = '',
        trackString = '',
        totalBytes = 0,
        track

    const sorted = []
    for ( const key in tracks )
        sorted[tracks[key].index] = tracks[key]

    for ( const track of sorted ) {
        trackAddresses += `0x${hexify(totalBytes)}, 0x00,\t\t// Address of track ${track.index}\n`
        trackString += `${track.atm.notes.join('\n')}\n`
        totalBytes += track.atm.bytes
    }

    return {
        totalBytes,
        trackAddresses,
        trackString
    }
}

function hexify (number) {
    const hex = number.toString(16)
    return `${hex.length < 2 ? 0 : ''}${hex}`
}

function concatAllChannels (bytesOffset, tracksOffset, channels) {
    let channelAddresses = '',
        channelString = '',
        totalBytes = bytesOffset,
        totalTracks = tracksOffset,
        channelEntryTracks = '',
        channel

    for ( let x = 0; x < 4; x++ ) {
        channel = channels[x]
        channelAddresses += `0x${hexify(totalBytes)}, 0x00,\t\t// Address of track ${totalTracks + x}\n`
        channelString += `${channel.notes.join('\n')}\n`
        channelEntryTracks += `0x${hexify(totalTracks + x)},\t\t\t// Channel ${x} entry track\n`
        totalBytes += channel.bytes
    }

    return {
        channelAddresses,
        channelString,
        channelEntryTracks
    }
}





function createNoteSequence (track) {
    if ( track.type === 'tune')
        return tuneSequence(track)
    else
        return drumSequence(track)
}

function tuneSequence (track) {
    const notes = track.notes,
          noteSequence = []

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

    noteSequence.push(67)

    return noteSequence
}

function drumSequence (track) {
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
                noteSequence[noteSequence.length - 1] = 0x9F + lastDelayTotal
            } else {
                wasEmpty = true
                noteSequence.push(0x00 + 0)
                noteSequence.push(0x9F + 1)
                lastDelayTotal = 1
            }
        } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
            skip = note === 'snare' ? 1 : note === 'shake' ? 3 : 15
            wasEmpty = false
            noteSequence = noteSequence.concat( getEffect(note) )
        }
    }

    return noteSequence
}

function getEffect (note) {
    switch (note) {
        case 'snare':
        return [64, 32, 65, -16, 161, 67]
        case 'shake':
        return [73, 4, 64, 32, 65, -8, 163, 74, 67]
        case 'crash':
        return [64, 32, 65, -2, 175, 67]
    }
}






// function createSong (tracks) {
//     const tracksLength = tracks.length

//     if ( !tracksLength ) {
//         return {
//             song: [],
//             songString: ''
//         }
//     }

//     let tracksHex = tracksLength.toString(16)
//     if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
//     let song = [
//         `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
//     ]
//     let nextTrackAddress = 0

//     song = song.concat(new Array(tracksLength/* * 2*/))
//     song = song.concat([null, null, null, null])

//     let drumTrackNumbers

//     tracks.forEach((track, i) => {
//         let converted

//         if ( track.channel === 3 ) {
//             drumTrackNumbers = getDrumTrackNumbers(tracksLength, track)
//             converted = convertDrumTrack(track, drumTrackNumbers)
            
//         } else {
//             converted = convertTrack(track)                  // get array from track notes

//             converted.noteSequence.unshift(`$$$0x40, ${48},\t\t\t// FX: SET VOLUME: volume = ${48}$$$`)
//             // converted.noteSequence.unshift(48)                          // volume value
//             // converted.noteSequence.unshift(64)                          // set volume
//             converted.trackBytes += 2
//         }


//         let nextTrackAddressHex = nextTrackAddress.toString(16)
//         if ( nextTrackAddressHex.length < 2 ) nextTrackAddressHex = `0${nextTrackAddressHex}`
//         song[(i/**2*/)+1] = `$$$0x${nextTrackAddressHex}, 0x00,\t\t\t// Address of track ${i}$$$`                            // Address of this track
//         // song[(i*2)+1] = nextTrackAddress                            // Address of this track
//         // song[(i*2)+2] = 0                                           // Address of this track pt2


//         if ( i === 0 ) {                                            // add tempo if this is the first track
//             converted.noteSequence.unshift(`$$$0x9D, ${50},\t\t\t// SET song tempo: value = ${50}$$$`)
//             // converted.noteSequence.unshift(50)                      // tempo value
//             // converted.noteSequence.unshift(157)                     // set tempo
//             converted.trackBytes += 2
//         }

//         song = song.concat("Track", converted.noteSequence)         // add array to song
//         nextTrackAddress = nextTrackAddress + converted.trackBytes  // calculate what the address of the next track will be

//         let indexHex = i.toString(16)
//         if ( indexHex.length < 2 ) indexHex = `0${indexHex}`
//         song[ 1 + (tracksLength /** 2*/) + ( track.channel ) ] = `$$$0x${indexHex},\t\t\t// Channel ${track.channel} entry track$$$`
//         // song[ 1 + (tracksLength * 2) + ( track.channel ) ] = i  // set starting track for the channel this track should be played on
//     })

//     if ( drumTrackNumbers ) {                                       // add drumtracks
//         song = addRequiredDrumTracks(song, drumTrackNumbers)
//     }

//     if ( tracksLength < 4 ) {                                       // add silent track for all remaining unused channels
//         song = addTrackAddress(song)

//         const tracksNumber = parseInt(song[0].slice(5, 7), 16) + 1

//         let tracksHex = tracksNumber.toString(16)
//         if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
//         song[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
//         song = song.concat([
//             "Track",
//             "$$$0x40, 0,\t\t\t// FX: SET VOLUME: volume = 0$$$",
//             "$$$0x9F,\t\t\t// FX: STOP CURRENT CHANNEL$$$"
//         ])
//         const lastTrackAddress = tracksNumber/* * 2*/ + 1 + 4
//         for ( let x = 1; x < lastTrackAddress; x++ ) {
//             if ( song[x] === null ) {
//                 let modifiedTracksLengthHex = (tracksNumber - 1).toString(16)
//                 if ( modifiedTracksLengthHex.length < 2 ) modifiedTracksLengthHex = `0${modifiedTracksLengthHex}`
//                 song[x] = `$$$0x${modifiedTracksLengthHex},\t\t\t// Channel ${x - tracksNumber/**2*/ - 1} entry track$$$`
//                 // song[x] = tracksNumber - 1
//             }
//         }
//     }

//     let songString = JSON.stringify(song, null, 4)
//     songString = songString.replace('[\n', '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n')
//     songString = songString.replace(/"Track"/ig, '//"Track"')
//     songString = songString.replace('CHANNEL$$$"\n]', 'CHANNEL\n};\n\n\n\n#endif\n')
//     songString = songString.replace('RETURN$$$"\n]', 'RETURN\n};\n\n\n\n#endif\n')

//     songString = songString.replace(/"?\$\$\$(",)?/g, '')
//     songString = songString.replace(/\\t/g, '\t')

//     return {
//         song,
//         songString
//     }
// }

// function convertTrack (track) {
//     const notes = track.notes
//     const noteSequence = createNoteSequenceWithComments(notes)
//     noteSequence.push("$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$")             // volume slide off
//     noteSequence.push("$$$0x9F,\t\t\t// FX: STOP CURRENT CHANNEL$$$")         // stop channel
//     const trackBytes = noteSequence.length
//     return {
//         noteSequence,
//         trackBytes
//     }
// }

// function convertDrumTrack (track, drumTrackNumbers) {
//     const notes = track.notes
//     let note,
//         noteSequence = [],
//         wasEmpty = false,
//         skip = 0,
//         lastDelayTotal
//     for ( let x = 0, l = track.ticks; x < l; x++ ) {
//         note = notes[x]
//         if ( note === undefined && skip-- < 1 ) {
//             if ( wasEmpty ) {
//                 lastDelayTotal++
//                 noteSequence[noteSequence.length - 1] = `$$$0x9F + ${lastDelayTotal},\t\t\t// DELAY: ticks = ${lastDelayTotal}$$$`
//             } else {
//                 wasEmpty = true
//                 noteSequence.push(`$$$0x00 + 0,\t\t\t// NOTE ON: note = 0$$$`)
//                 noteSequence.push(`$$$0x9F + 1,\t\t\t// DELAY: ticks = 1$$$`)
//                 lastDelayTotal = 1
//             }
//         } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
//             skip = note === 'snare' ? 1 : note === 'shake' ? 3 : 15
//             wasEmpty = false
//             noteSequence.push(`$$$0xFC, ${drumTrackNumbers[note]},\t\t\t// GOTO track ${drumTrackNumbers[note]}$$$`)
//         }
//     }
//     noteSequence.push("$$$0x9F,\t\t\t// FX: STOP CURRENT CHANNEL$$$")
//     return {
//         noteSequence,
//         trackBytes: noteSequence.length
//     }
// }

// function getDrumTrackNumbers (tracks, track) {
//     let counter = tracks
//     const notes = track.notes
//     const trackNumbers = {
//         snare: null,
//         shake: null,
//         crash: null
//     }
//     for ( const note of notes ) {
//         switch (note) {
//             case 'snare':
//             if ( !trackNumbers.snare ) trackNumbers.snare = counter++
//             break

//             case 'shake':
//             if ( !trackNumbers.shake ) trackNumbers.shake = counter++
//             break

//             case 'crash':
//             if ( !trackNumbers.crash ) trackNumbers.crash = counter++
//             break
//         }
//     }
//     return trackNumbers
// }

// function addRequiredDrumTracks (song, drumTrackNumbers) {
//     let newSong = song.slice()
//     let tracks = parseInt(song[0].slice(5, 7), 16)
//     if ( drumTrackNumbers.snare ) {
//         newSong = addTrackAddress(newSong)                              // add track address
//         newSong = [].concat(newSong, [                                  // add snare track
//             "Track",
//             "$$$0x40, 32,\t\t\t// FX: SET VOLUME: volume = 32$$$",
//             "$$$0x41, -16,\t\t\t// FX: VOLUME SLIDE ON: steps = -16$$$",
//             "$$$0x9F + 2,\t\t\t// DELAY: ticks = 2$$$",
//             "$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$",
//             "$$$0xFE,\t\t\t// RETURN$$$"
//         ])
//         tracks++
//         let tracksHex = tracks.toString(16)
//         if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
//         newSong[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
//     }
//     if ( drumTrackNumbers.shake ) {
//         newSong = addTrackAddress(newSong)                              // add track address
//         newSong = [].concat(newSong, [                                  // add shake track
//             "Track",
//             "$$$0x49, 4 + 0,\t\t// FX: RETRIG NOISE: point = 1 (*4) / speed = 0 (fastest)$$$",
//             "$$$0x40, 32,\t\t\t// FX: SET VOLUME: volume = 32$$$",
//             "$$$0x41, -8,\t\t\t// FX: VOLUME SLIDE ON: steps = -8$$$",
//             "$$$0x9F + 4,\t\t\t// DELAY: ticks = 4$$$",
//             "$$$0x4A,\t\t\t// FX: RETRIG: off$$$",
//             "$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$",
//             "$$$0xFE,\t\t\t// RETURN$$$"
//         ])
//         tracks++
//         let tracksHex = tracks.toString(16)
//         if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
//         newSong[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
//     }
//     if ( drumTrackNumbers.crash ) {
//         newSong = addTrackAddress(newSong)                              // add track address
//         newSong = [].concat(newSong, [                                  // add crash track
//             "Track",
//             "$$$0x40, 32,\t\t\t// FX: SET VOLUME: volume = 32$$$",
//             "$$$0x41, -2,\t\t\t// FX: VOLUME SLIDE ON: steps = -2$$$",
//             "$$$0x9F + 16,\t\t\t// DELAY: ticks = 16$$$",
//             "$$$0x43,\t\t\t// FX: VOLUME SLIDE OFF$$$",
//             "$$$0xFE,\t\t\t// RETURN$$$"
//         ])
//         tracks++
//         let tracksHex = tracks.toString(16)
//         if ( tracksHex.length < 2 ) tracksHex = `0${tracksHex}`
//         newSong[0] = `$$$0x${tracksHex},\t\t\t// Number of tracks$$$`
//     }
//     return newSong
// }

// function addTrackAddress (song) {
//     const tracks = parseInt(song[0].slice(5, 7), 16)
//     const afterLastTrackIndex = tracks/* * 2*/ + 1

//     const reversedSong = song.slice().reverse()
//     let lastTrackReversed = ''
//     for ( let x = 0; x >= 0; x++ ) {
//         if ( reversedSong[x] === 'Track' )
//             break
//         lastTrackReversed += reversedSong[x]
//     }
//     const lastTrackLength = lastTrackReversed.split(',').length - 1

//     let lastTrackBytes = parseInt(song[afterLastTrackIndex - 1].slice(5, 7), 16) + lastTrackLength
//     lastTrackBytes = lastTrackBytes.toString(16)
//     if ( lastTrackBytes.length < 2 ) lastTrackBytes = `0${lastTrackBytes}`
//     const address = `$$$0x${lastTrackBytes}, 0x00,\t\t\t// Address of track ${tracks}$$$`
//     const result = [].concat(song.slice(0, afterLastTrackIndex), address, song.slice(afterLastTrackIndex)) // add track address to song
//     return result
// }

// function createNoteSequenceWithComments (notes) {
//     const noteSequence = []

//     let thisNote,
//         lastNote = -1,
//         thisNoteNumber,
//         lastDelayTotal

//     for ( const note of notes ) {
//         thisNote = (note||{}).active
//         thisNoteNumber = ~thisNote ? thisNote : 0
//         if ( thisNote === lastNote ) {
//             if ( !noteSequence.length ) {
//                 noteSequence[0] = `$$$0x00 + ${thisNoteNumber},\t\t\t// NOTE ON: note = ${thisNoteNumber}$$$`
//                 noteSequence[1] = '$$$0x9F + 1,\t\t\t// DELAY: ticks = 1$$$'
//                 lastDelayTotal = 1
//             } else {
//                 const lastDelay = noteSequence[noteSequence.length - 1]
//                 lastDelayTotal++
//                 noteSequence[noteSequence.length - 1] = `$$$0x9F + ${lastDelayTotal},\t\t\t// DELAY: ticks = ${lastDelayTotal}$$$`
//             }
//         } else {
//             noteSequence.push(`$$$0x00 + ${thisNoteNumber},\t\t\t// NOTE ON: note = ${thisNoteNumber}$$$`)   // note to play
//             noteSequence.push('$$$0x9F + 1,\t\t\t// DELAY: ticks = 1$$$')                         // play for 1 tick
//             lastDelayTotal = 1
//         }
//         lastNote = thisNote
//     }

//     return noteSequence
// }
