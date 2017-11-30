export { createNoteSequence, createSongFromChannels, getEffectLength }

const drumPatterns = {
    snare: {
        notes: [
            "//\"Pattern snare\"",
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
            "//\"Pattern shake\"",
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
            "//\"Pattern crash\"",
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
            "//\"Pattern tick\"",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x9F + 1,\t\t// DELAY: ticks = 1",
            "0x40, 0,\t\t// FX: SET VOLUME: volume = 0",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 6
    },
    short_crash: {
        notes: [
            "//\"Pattern short crash\"",
            "0x40, 32,\t\t// FX: SET VOLUME: volume = 32",
            "0x41, -4,\t\t// FX: VOLUME SLIDE ON: steps = -4",
            "0x9F + 8,\t\t// DELAY: ticks = 8",
            "0x43,\t\t\t// FX: VOLUME SLIDE OFF",
            "0xFE,\t\t\t// RETURN"
        ],
        bytes: 7
    }
}

function createSongFromChannels (patterns, channels, fx) {

    const patternAtm = {}
    let totalPatterns = 0

    const requiredDrumPatterns = getRequiredDrumPatterns(patterns)
    for ( const key in requiredDrumPatterns ) {
        if ( requiredDrumPatterns[key] !== false ) {
            totalPatterns++
            patternAtm[key] = {
                pattern: {},
                index: totalPatterns - 1,
                atm: drumPatterns[key]
            }
        }
    }

    let pattern
    for ( let x = 0, l = patterns.length; x < l; x++ ) {
        pattern = patterns[x]
        totalPatterns++
        patternAtm[pattern.id] = {
            pattern,
            index: totalPatterns - 1,
            atm: atmifyPattern(requiredDrumPatterns, pattern)
        }
    }

    const channelPatterns = []
    for ( let i = 0; i < 4; i++ )
        channelPatterns.push(atmifyChannel({
            patterns: patternAtm,
            channel: channels[i],
            index: i,
            effects: fx.channel[i],
            patternEffects: fx.pattern
        }))

    const { channelAddresses, channelString, channelEntryPatterns, totalBytes } = concatAllChannels(/*totalPatterns, */channelPatterns)
    const { patternAddresses, patternString/*, totalBytes*/ } = concatAllPatterns(totalBytes, patternAtm)
    totalPatterns += 4

    let completeSong = '#ifndef SONG_H\n#define SONG_H\n\n#define Song const uint8_t PROGMEM\n\nSong music[] = {\n'
    completeSong += `0x${hexify(totalPatterns)},\t\t\t// Number of patterns\n`
    completeSong += channelAddresses
    completeSong += patternAddresses
    completeSong += channelEntryPatterns
    completeSong += channelString
    completeSong += patternString
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

function atmifyChannel ({patterns, channel, /*addTempo,*/ index, /*tempo, */effects, patternEffects}) {
    let channelPattern = []
    let totalBytes = 0

    const newFxStart = createFxArray(getFxList(effects, 'first'), 'start', effects)
    channelPattern = channelPattern.concat(newFxStart.fx)
    totalBytes += newFxStart.bytes

    let previousPatternId = -1,
        previousPatternEffects = 0,
        count = 0
    for ( const pattern of channel ) {

        const eff = patternEffects[pattern.editorId] || {flags:0}

        if ( previousPatternId === pattern.id && !eff.flags && !previousPatternEffects ) {

            count++
            channelPattern.pop()
            channelPattern.push(`0xFD, ${count}, ${patterns[pattern.id].index + 4},\t\t// REPEAT: count = ${count} + 1 / pattern = ${patterns[pattern.id].index + 4}`)
            if ( count === 1 )
                totalBytes++ // we remove a line with 2 bytes (GOTO = 2 bytes) and we add 3 bytes (REPEAT = 3 bytes)

        } else {

            let startFx,
                endFx
            if ( eff.flags ) {
                startFx = createFxArray(getFxList(eff, 'first'), 'start', eff)
                endFx = createFxArray(getFxList(eff, 'last'), 'end', eff)
            }

            // add first pattern fx before pattern
            if ( startFx ) {
                channelPattern = channelPattern.concat(startFx.fx)
                totalBytes += startFx.bytes
            }

            count = 0
            channelPattern.push(`0xFC, ${patterns[pattern.id].index + 4},\t\t// GOTO pattern ${patterns[pattern.id].index + 4}`)    // goto pattern
            totalBytes += 2

            // add last pattern fx after pattern
            if ( endFx ) {
                channelPattern = channelPattern.concat(endFx.fx)
                totalBytes += endFx.bytes
            }

            previousPatternId = pattern.id
            previousPatternEffects = eff.flags
        }

    }

    // add fx after channel
    const newFxEnd = createFxArray(getFxList(effects, 'last'), 'end', effects)
    channelPattern = channelPattern.concat(newFxEnd.fx)
    totalBytes += newFxEnd.bytes

    channelPattern.push('0x9F,\t\t\t// FX: STOP CURRENT CHANNEL')                                             // end of channel
    totalBytes++

    channelPattern.unshift(`//\"Pattern channel ${index}\"`)

    return { notes: channelPattern, bytes: totalBytes }
}

function atmifyPattern (requiredDrumPatterns, pattern) {
    if ( pattern.type === 'tune' )
        return atmifyRegularPattern(pattern)
    else
        return atmifyDrumPattern(requiredDrumPatterns, pattern)
}

function atmifyRegularPattern (pattern) {
    const notes = pattern.notes
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

    noteSequence.push('0xFE,\t\t\t// RETURN')                 // end of pattern (RETURN)
    totalBytes++

    noteSequence.unshift(`//\"Pattern ${pattern.name}\"`)

    return { notes: noteSequence, bytes: totalBytes }
}

function atmifyDrumPattern (drumPatternNumbers, pattern) {
    const notes = pattern.notes

    let note,
        noteSequence = [],
        wasEmpty = false,
        skip = 0,
        lastDelayTotal,
        totalBytes = 0

    for ( let x = 0, l = pattern.ticks; x < l; x++ ) {
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
            noteSequence.push(`0xFC, ${drumPatternNumbers[note] + 4},\t\t// GOTO pattern ${drumPatternNumbers[note] + 4}`)
            totalBytes += 2
        }
    }

    noteSequence.push('0xFE,\t\t\t// RETURN')                 // end of pattern (RETURN)
    totalBytes++

    noteSequence.unshift(`//\"Pattern ${pattern.name}\"`)

    return {
        notes: noteSequence,
        bytes: totalBytes
    }
}

function getRequiredDrumPatterns (patterns) {
    let pattern,
        notes
    const required = {}
    for ( let i = 0, l = patterns.length; i < l; i++ ) {
        pattern = patterns[i]
        if ( pattern.type === 'drum' ) {
            notes = pattern.notes
            for ( let i = 0, l = notes.length; i < l; i++ )
                if ( notes[i] ) required[notes[i]] = true
        }
    }

    const names = Object.getOwnPropertyNames(required)
    for ( let i = 0, l = names.length; i < l; i++ )
        required[names[i]] = i

    return required
}

function concatAllPatterns (bytesOffset, patterns) {
    let patternAddresses = '',
        patternString = '',
        totalBytes = bytesOffset,
        pattern,
        hexified

    const sorted = []
    for ( const key in patterns )
        sorted[patterns[key].index] = patterns[key]

    for ( const pattern of sorted ) {
        hexified = hexify(totalBytes)
        patternAddresses += `0x${hexified.slice(-2)}, 0x${hexified.slice(-4, -3) || 0}${hexified.slice(-3, -2) || 0},\t\t// Address of pattern ${pattern.index + 4}\n`
        patternString += `${pattern.atm.notes.join('\n')}\n`
        totalBytes += pattern.atm.bytes
    }

    return {
        // totalBytes,
        patternAddresses,
        patternString
    }
}

function hexify (number, nopadding) {
    let hex = number.toString(16)
    if ( !nopadding )
        hex = `${hex.length < 2 ? 0 : ''}${hex}`
    return hex
}

function concatAllChannels (/*patternsOffset, */channels) {
    let channelAddresses = '',
        channelString = '',
        totalBytes = 0,
        // totalPatterns = 0,
        channelEntryPatterns = '',
        channel,
        hexified

    for ( let x = 0; x < 4; x++ ) {
        channel = channels[x]
        hexified = hexify(totalBytes)
        channelAddresses += `0x${hexified.slice(-2)}, 0x${hexified.slice(-4, -3) || 0}${hexified.slice(-3, -2) || 0},\t\t// Address of pattern ${/*totalPatterns + */x}\n`
        channelString += `${channel.notes.join('\n')}\n`
        channelEntryPatterns += `0x${hexify(/*totalPatterns + */x)},\t\t\t// Channel ${x} entry pattern\n`
        totalBytes += channel.bytes
    }

    return {
        channelAddresses,
        channelString,
        channelEntryPatterns,
        totalBytes
    }
}





function createNoteSequence (pattern) {
    if ( pattern.type === 'tune')
        return tuneSequence(pattern)
    else
        return drumSequence(pattern)
}

function tuneSequence (pattern) {
    const notes = pattern.notes,
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

function drumSequence (pattern) {
    const notes = pattern.notes

    let note,
        noteSequence = [],
        wasEmpty = false,
        skip = 0,
        lastDelayTotal

    for ( let x = 0, l = pattern.ticks; x < l; x++ ) {
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
