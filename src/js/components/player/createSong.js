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

function createSongFromChannels (tracks, channels, fx) {

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
        channelTracks.push(atmifyChannel({
            tracks: trackAtm,
            channel: channels[i],
            index: i,
            effects: fx.channel[i],
            trackEffects: fx.track
        }))

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

const startFx = {
    1: {
        name: 'FX: SET VOLUME: volume = {val_0}',
        values: 1,
        // comment: 'set volume'
        address: '40'
    },
    2: {
        name: 'FX: SLIDE VOLUME ON: {val_0}',
        values: 1,
        address: '41'
    },
    4: {
        name: 'FX: SLIDE VOLUME ADVANCED: {val_0} {val_1}',
        values: 2,
        address: '42'
    },
    16: {
        name: 'FX: SLIDE FREQUENCY ON: {val_0}',
        values: 1,
        address: '44'
    },
    32: {
        name: 'FX: SLIDE FREQUENCY ADVANCED: {val_0} {val_1}',
        values: 2,
        address: '45'
    },
    128: {
        name: 'FX: SET ARPEGGIO: {val_0} {val_1} {val_2} {val_3} {val_4}',
        values: 5,
        address: '47'
    },
    512: {
        name: 'FX: SET TRANSPOSITION: {val_0}',
        values: 1,
        address: '4C'
    },
    1024: {
        name: 'FX: ADD TRANSPOSITION: {val_0}',
        values: 1,
        address: '4B'
    },
    4096: {
        name: 'FX: SET TREMOLO: {val_0} {val_1}',
        values: 2,
        address: '4E'
    },
    16384: {
        name: 'FX: SET VIBRATO: {val_0} {val_1}',
        values: 2,
        address: '50'
    },
    65536: {
        name: 'FX: SET GLISSANDO: {val_0}',
        values: 1,
        address: '52'
    },
    262144: {
        name: 'FX: SET NOTE CUT: {val_0}',
        values: 1,
        address: '54'
    },
    1048576: {
        name: 'FX: SET TEMPO: tempo = {val_0}',
        values: 1,
        address: '9D'
    },
    2097152: {
        name: 'FX: ADD TEMPO: {val_0}',
        values: 1,
        address: '9C'
    }
}

const endFx = {
    8: {
        name: 'FX: SLIDE VOLUME OFF',
        values: 0,
        address: '43',
        extraTab: true
    },
    64: {
        name: 'FX: SLIDE FREQUENCY OFF',
        values: 0,
        address: '46',
        extraTab: true
    },
    256: {
        name: 'FX: ARPEGGIO OFF',
        values: 0,
        address: '48',
        extraTab: true
    },
    2048: {
        name: 'FX: TRANSPOSITION OFF',
        values: 0,
        address: '4D',
        extraTab: true
    },
    8192: {
        name: 'FX: TREMOLO OFF',
        values: 0,
        address: '4F',
        extraTab: true
    },
    32768: {
        name: 'FX: VIBRATO OFF',
        values: 0,
        address: '51',
        extraTab: true
    },
    131072: {
        name: 'FX: GLISSANDO OFF',
        values: 0,
        address: '53',
        extraTab: true
    },
    524288: {
        name: 'FX: NOTE CUT OFF',
        values: 0,
        address: '55',
        extraTab: true
    }
}

function getFxList (effects, type) {
    const active = [],
          activeFx = effects.flags

    const startFxList = [
        1,
        2,
        4,
        16,
        32,
        128,
        512,
        1024,
        4096,
        16384,
        65536,
        262144,
        1048576,
        2097152
    ]
    const lastFxList = [
        8,
        64,
        256,
        2048,
        8192,
        32768,
        131072,
        524288
    ]
    const activeList = type === 'first' ? startFxList : lastFxList

    for ( let i = 0; i < 14; i++ ) {
        if ( activeList[i] & activeFx )
            active.push(activeList[i])
    }

    return active
}

function createFxArray (fxToAdd, type, effects) {
    const result = {
        fx: [],
        bytes: 0
    }

    const fxList = type === 'start' ? startFx : endFx

    let fxInfo,
        fxData
    for ( let i = 0, l = fxToAdd.length; i < l; i++ ) {
        fxInfo = fxList[fxToAdd[i]]
        fxData = effects.fx[fxToAdd[i]] || {}

        let params = ','

        const values = fxInfo.values
        if ( values < 5 && values > 0 )
            params += ` ${fxData.val_0||0},`
        if ( values > 1 && values < 5 )
            params += ` ${fxData.val_1||0},`
        if ( values === 5 ) { // then it's arpeggio
            params += ` 0x${hexify(fxData.val_2, true)}${hexify(fxData.val_3, true)}`
            params += `, 0x${fxData.val_0 ? '40' : '00'}`
            params += ` + 0x${fxData.val_1 ? '20' : '00'}`
            params += ` + ${fxData.val_4},`
        }

        result.fx.push(`0x${fxInfo.address}${params}\t\t${fxInfo.extraTab?'\t':''}// ${createInfoComment(fxInfo.name, fxData)}`)

        if ( values !== 5 )
            result.bytes += fxInfo.values + 1
        else
            result.bytes += 3
    }

    return result
}

function createInfoComment (template, values) {
    let result = template
    for ( const v in values ) {
        result = result.replace(`{${v}}`, values[v]||0)
    }
    return result
}

function atmifyChannel ({tracks, channel, /*addTempo,*/ index, /*tempo, */effects, trackEffects}) {
    let channelTrack = []
    let totalBytes = 0

    const newFxStart = createFxArray(getFxList(effects, 'first'), 'start', effects)
    channelTrack = channelTrack.concat(newFxStart.fx)
    totalBytes += newFxStart.bytes

    let previousTrackId = -1,
        previousTrackEffects = 0,
        count = 0
    for ( const track of channel ) {

        const eff = trackEffects[track.editorId] || {flags:0}

        if ( previousTrackId === track.id && !eff.flags && !previousTrackEffects ) {

            count++
            channelTrack.pop()
            channelTrack.push(`0xFD, ${count}, ${tracks[track.id].index + 4},\t\t// REPEAT: count = ${count} + 1 / track = ${tracks[track.id].index + 4}`)
            if ( count === 1 )
                totalBytes++ // we remove a line with 2 bytes (GOTO = 2 bytes) and we add 3 bytes (REPEAT = 3 bytes)

        } else {

            let startFx,
                endFx
            if ( eff.flags ) {
                startFx = createFxArray(getFxList(eff, 'first'), 'start', eff)
                endFx = createFxArray(getFxList(eff, 'last'), 'end', eff)
            }

            // add first track fx before track
            if ( startFx ) {
                channelTrack = channelTrack.concat(startFx.fx)
                totalBytes += startFx.bytes
            }

            count = 0
            channelTrack.push(`0xFC, ${tracks[track.id].index + 4},\t\t// GOTO track ${tracks[track.id].index + 4}`)    // goto track
            totalBytes += 2

            // add last track fx after track
            if ( endFx ) {
                channelTrack = channelTrack.concat(endFx.fx)
                totalBytes += endFx.bytes
            }

            previousTrackId = track.id
            previousTrackEffects = eff.flags
        }

    }

    // add fx after channel
    const newFxEnd = createFxArray(getFxList(effects, 'last'), 'end', effects)
    channelTrack = channelTrack.concat(newFxEnd.fx)
    totalBytes += newFxEnd.bytes

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
        if ( (note === undefined || note === null) && skip-- < 1 ) {
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
            noteSequence.push(`0xFC, ${drumTrackNumbers[note] + 4},\t\t// GOTO track ${drumTrackNumbers[note] + 4}`)
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

function hexify (number, nopadding) {
    let hex = number.toString(16)
    if ( !nopadding )
        hex = `${hex.length < 2 ? 0 : ''}${hex}`
    return hex
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
