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
    },
    tick: {
        notes: [
            "//\"Track tick\"",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x9F + 1,\t\t// DELAY: ticks = 1",
            "0x40, 0,\t\t// FX: SET VOLUME: volume = 0",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 6
    },
    short_crash: {
        notes: [
            "//\"Track short crash\"",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x41, -4,\t\t// FX: VOLUME SLIDE ON: steps = -4",
            "0x9F + 8,\t\t// DELAY: ticks = 8",
            "0x43,\t\t\t// FX: VOLUME SLIDE OFF",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 7
    }
}

function createSongFromChannels (tracks, channels, tempo) {

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
        channelTracks.push(atmifyChannel(trackAtm, channels[i], i===0, i, tempo))

    const { channelAddresses, channelString, channelEntryTracks, totalBytes } = concatAllChannels(/*totalTracks, */channelTracks)
    const { trackAddresses, trackString/*, totalBytes*/ } = concatAllTracks(totalBytes, trackAtm)
    totalTracks += 4

    let completeSong = '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n'
    completeSong += `0x${hexify(totalTracks)},\t\t\t// Number of tracks\n`
    completeSong += channelAddresses
    completeSong += trackAddresses
    completeSong += channelEntryTracks
    completeSong += channelString
    completeSong += trackString
    completeSong += '\n};\n\n\n\n#endif\n'

    return completeSong

}

function atmifyChannel (tracks, channel, addTempo, index, tempo) {
    const channelTrack = []
    let totalBytes = 0
    if ( addTempo ) {
        channelTrack.push(`0x9D, ${tempo},\t\t// SET song tempo: value = ${tempo}`)                                     // add song tempo
        totalBytes += 2
    }

    const channelVolume = channel.length && index !== 3 ? 48 : 0
    channelTrack.push(`0x40, ${channelVolume},\t\t// FX: SET VOLUME: volume = ${channelVolume}`)
    totalBytes += 2

    let previousTrackId = -1,
        count = 0
    for ( const track of channel ) {

        if ( previousTrackId === track.id ) {

            count++
            channelTrack.pop()
            channelTrack.push(`0xFD, ${count}, ${tracks[track.id].index + 4},\t\t// REPEAT: count = ${count} + 1 / track = ${tracks[track.id].index + 4}`)
            if ( count === 1 )
                totalBytes++ // we remove a line with 2 bytes (GOTO = 2 bytes) and we add 3 bytes (REPEAT = 3 bytes)

        } else {

            count = 0
            channelTrack.push(`0xFC, ${tracks[track.id].index + 4},\t\t// GOTO track ${tracks[track.id].index + 4}`)    // goto track
            totalBytes += 2

            previousTrackId = track.id
        }

    }

    if ( channelTrack.slice(-1)[0] !== '0x40, 0,\t\t// FX: SET VOLUME: volume = 0' ) {
        channelTrack.push('0x40, 0,\t\t// FX: SET VOLUME: volume = 0')
        totalBytes += 2
    }

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
            } else {
                wasEmpty = true
                // noteSequence.push(`0x00 + 0,\t\t// NOTE ON: note = 0`)
                noteSequence.push(`0x9F + 1,\t\t// DELAY: ticks = 1`)
                lastDelayTotal = 1
                totalBytes += 1
            }
        } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
            skip = getEffectLength(note)
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
    let track,
        notes
    const required = {}
    for ( let i = 0, l = tracks.length; i < l; i++ ) {
        track = tracks[i]
        if ( track.type === 'drum' ) {
            notes = track.notes
            for ( let i = 0, l = notes.length; i < l; i++ )
                if ( notes[i] ) required[notes[i]] = true
        }
    }

    const names = Object.getOwnPropertyNames(required)
    for ( let i = 0, l = names.length; i < l; i++ )
        required[names[i]] = i

    return required
}

function concatAllTracks (bytesOffset, tracks) {
    let trackAddresses = '',
        trackString = '',
        totalBytes = bytesOffset,
        track,
        hexified

    const sorted = []
    for ( const key in tracks )
        sorted[tracks[key].index] = tracks[key]

    for ( const track of sorted ) {
        hexified = hexify(totalBytes)
        trackAddresses += `0x${hexified.slice(-2)}, 0x${hexified.slice(-4, -3) || 0}${hexified.slice(-3, -2) || 0},\t\t// Address of track ${track.index + 4}\n`
        trackString += `${track.atm.notes.join('\n')}\n`
        totalBytes += track.atm.bytes
    }

    return {
        // totalBytes,
        trackAddresses,
        trackString
    }
}

function hexify (number) {
    const hex = number.toString(16)
    return `${hex.length < 2 ? 0 : ''}${hex}`
}

function concatAllChannels (/*tracksOffset, */channels) {
    let channelAddresses = '',
        channelString = '',
        totalBytes = 0,
        // totalTracks = 0,
        channelEntryTracks = '',
        channel,
        hexified

    for ( let x = 0; x < 4; x++ ) {
        channel = channels[x]
        hexified = hexify(totalBytes)
        channelAddresses += `0x${hexified.slice(-2)}, 0x${hexified.slice(-4, -3) || 0}${hexified.slice(-3, -2) || 0},\t\t// Address of track ${/*totalTracks + */x}\n`
        channelString += `${channel.notes.join('\n')}\n`
        channelEntryTracks += `0x${hexify(/*totalTracks + */x)},\t\t\t// Channel ${x} entry track\n`
        totalBytes += channel.bytes
    }

    return {
        channelAddresses,
        channelString,
        channelEntryTracks,
        totalBytes
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
                noteSequence.push(0x40)
                noteSequence.push(0)
                noteSequence.push(0x9F + 1)
                lastDelayTotal = 1
            }
        } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
            skip = getEffectLength(note)
            // skip = note === 'snare' ? 1 : note === 'shake' ? 3 : 15
            wasEmpty = false
            noteSequence = noteSequence.concat( getEffect(note) )
        }
    }

    return noteSequence
}

function getEffectLength (effectName) {
    switch (effectName) {
        case 'snare': return 1
        case 'shake': return 3
        case 'crash': return 15
        case 'tick': return 0
        case 'short_crash': return 7
    }
}

function getEffect (note) {
    switch (note) {
        case 'snare':
        return [64, 32, 65, -16, 161, 67]
        case 'shake':
        return [73, 4, 64, 32, 65, -8, 163, 74, 67]
        case 'crash':
        return [64, 32, 65, -2, 175, 67]
        case 'tick':
        return [64, 32, 160, 64, 0]
        case 'short_crash':
        return [64, 32, 65, -4, 167, 67]
    }
}
