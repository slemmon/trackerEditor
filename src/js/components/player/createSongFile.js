import { getEffectLength } from './createSong';
import orderBy from 'lodash.orderby';

export { createSongFileFromChannels };


/////////////////////////////////////////////////////
// 
// createSongFromChannels constants
// 
/////////////////////////////////////////////////////

// The suffix to use for all sharp notes
const sharpSuffix = '_';

// The note value corresponding to each index on the scale as described in the
// atm_immediate_cmd_constants here:
// https://github.com/moduscreate/ATMlib/blob/ATMLib2/src/atm_cmd_constants.h#L3
const noteVal = {
  1: {
    letter: 'C'
  },
  2: {
    letter: 'C',
    suffix: sharpSuffix
  },
  3: {
    letter: 'D'
  },
  4: {
    letter: 'D',
    suffix: sharpSuffix
  },
  5: {
    letter: 'E'
  },
  6: {
    letter: 'F'
  },
  7: {
    letter: 'F',
    suffix: sharpSuffix
  },
  8: {
    letter: 'G'
  },
  9: {
    letter: 'G',
    suffix: sharpSuffix
  },
  10: {
    letter: 'A'
  },
  11: {
    letter: 'A',
    suffix: sharpSuffix
  },
  12: {
    letter: 'B'
  }
};

// All drum track patterns described
const drumTracks = {
  snare: {
    notes: [
      // "//\"Track snare\"",
      'ATM_CMD_M_SET_VOLUME(16)',
      'ATM_CMD_M_SLIDE_VOL_ON(-8)',
      'ATM_CMD_M_DELAY_TICKS(2)',
      'ATM_CMD_M_SLIDE_VOL_OFF',
      'ATM_CMD_I_RETURN'
    ],
    bytes: 7
  },
  shake: {
    notes: [
      // "//\"Track shake\"",
      'ATM_CMD_M_NOISE_RETRIG_ON(4)',
      'ATM_CMD_M_SET_VOLUME(31)',
      'ATM_CMD_M_SLIDE_VOL_ON(-8)',
      'ATM_CMD_M_DELAY_TICKS(4)',
      'ATM_CMD_I_NOISE_RETRIG_OFF',
      'ATM_CMD_M_SLIDE_VOL_OFF',
      'ATM_CMD_I_RETURN'
    ],
    bytes: 10
  },
  crash: {
    notes: [
      // "//\"Track crash\"",
      'ATM_CMD_M_SET_VOLUME(31)',
      'ATM_CMD_M_SLIDE_VOL_ON(-2)',
      'ATM_CMD_M_DELAY_TICKS(16)',
      'ATM_CMD_M_SLIDE_VOL_OFF',
      'ATM_CMD_I_RETURN'
    ],
    bytes: 7
  },
  tick: {
    notes: [
      // "//\"Track tick\"",
      'ATM_CMD_M_SET_VOLUME(31)',
      'ATM_CMD_M_DELAY_TICKS(1)',
      'ATM_CMD_M_SET_VOLUME(0)',
      'ATM_CMD_I_RETURN'
    ],
    bytes: 6
  },
  short_crash: {
    notes: [
      // "//\"Track short crash\"",
      'ATM_CMD_M_SET_VOLUME(31)',
      'ATM_CMD_M_SLIDE_VOL_ON(-4)',
      'ATM_CMD_M_DELAY_TICKS(8)',
      'ATM_CMD_M_SLIDE_VOL_OFF',
      'ATM_CMD_I_RETURN'
    ],
    bytes: 7
  }
};

// hash of starting effects correlating an id from the tracker format to the
// commands and value data needed for the final audio file output
const startFx = {
  1: {
    cmd: 'ATM_CMD_M_SET_VOLUME(${paramsList})',
    values: 1
  },
  2: {
    cmd: 'ATM_CMD_M_SLIDE_VOL_ON(${paramsList})',
    values: 1
  },
  4: {
    cmd: 'ATM_CMD_M_SLIDE_VOL_ADV_ON(${paramsList})',
    values: 2
  },
  16: {
    cmd: 'ATM_CMD_M_SLIDE_FREQ_ON(${paramsList})',
    values: 1
  },
  32: {
    cmd: 'ATM_CMD_M_SLIDE_FREQ_ADV_ON(${paramsList})',
    values: 2
  },
  128: {
    cmd: 'ATM_CMD_M_ARPEGGIO_ON(${paramsList})',
    values: 5
  },
  512: {
    cmd: 'ATM_CMD_M_SET_TRANSPOSITION(${paramsList})',
    values: 1
  },
  1024: {
    cmd: 'ATM_CMD_M_ADD_TRANSPOSITION(${paramsList})',
    values: 1
  },
  4096: {
    cmd: 'ATM_CMD_M_TREMOLO_ON(${paramsList})',
    values: 2
  },
  16384: {
    cmd: 'ATM_CMD_M_VIBRATO_ON(${paramsList})',
    values: 2
  },
  65536: {
    cmd: 'ATM_CMD_M_GLISSANDO_ON(${paramsList})',
    values: 1
  },
  262144: {
    cmd: 'ATM_CMD_M_NOTECUT_ON(${paramsList})',
    values: 1
  },
  1048576: {
    cmd: 'ATM_CMD_M_SET_TEMPO(${paramsList})',
    values: 1
  },
  2097152: {
    cmd: 'ATM_CMD_M_ADD_TEMPO(${paramsList})',
    values: 1
  }
};

// hash of ending effects correlating an id from the tracker format to the
// commands and value data needed for the final audio file output
const endFx = {
  8: {
    cmd: 'ATM_CMD_M_SLIDE_VOL_OFF',
    values: 0
  },
  64: {
    cmd: 'ATM_CMD_M_SLIDE_FREQ_OFF',
    values: 0
  },
  256: {
    cmd: 'ATM_CMD_I_ARPEGGIO_OFF',
    values: 0
  },
  2048: {
    cmd: 'ATM_CMD_I_TRANSPOSITION_OFF',
    values: 0
  },
  8192: {
    cmd: 'ATM_CMD_M_TREMOLO_OFF',
    values: 0
  },
  32768: {
    cmd: 'ATM_CMD_M_VIBRATO_OFF',
    values: 0
  },
  131072: {
    cmd: 'ATM_CMD_I_GLISSANDO_OFF',
    values: 0
  },
  524288: {
    cmd: 'ATM_CMD_I_NOTECUT_OFF',
    values: 0
  }
};


/////////////////////////////////////////////////////
// 
// createSongFromChannels functions
// 
/////////////////////////////////////////////////////

/**
 * Outputs the text needed for a header file used by Arduboy as an audio file
 * @param {Object} song The song object containing tracks, channels, and fx keys
 * @return {String} The audio file content.  See the following for reference:
 * https://github.com/moduscreate/ATMlib/blob/d8a8631d6ba53179f284ef3de74aeb125de6fe47/examples/songs/song01_sfx/song.h
 */
function createSongFileFromChannels (song) {
  const { channels, fx, songName, songRepeat, tracks } = song;
  const normalizedSongName = songName.replace(/[ -]/g, '_');
  const trackAtm = {};
  let totalTracks = 0;
  
  // round up all percussion pattern instances (tick, snare, crash, etc.) to add
  // to the patterns array
  const requiredDrumTracks = getRequiredDrumTracks(tracks);

  // add all percussion patterns to the patterns object containing all
  // non-channel patterns
  Object.keys(requiredDrumTracks).forEach(key => {
    totalTracks++;
    trackAtm[key] = {
      type: 'pattern',
      typeText: 'pattern (drum)',
      track: {},
      index: totalTracks - 1,
      atm: drumTracks[key]
    };
  });
  
  tracks.forEach((track, i) => {
    totalTracks++;
    trackAtm[track.id] = {
      type: 'pattern',
      typeText: 'pattern (tune)',
      name: track.name,
      track,
      index: totalTracks - 1,
      atm: atmifyTrack(requiredDrumTracks, track)
    };
  });

  const channelTracks = channels.map((channel, i) => {
    return {
      type: 'channel',
      typeText: 'pattern (channel)',
      atm: atmifyChannel({
        channel,
        effects: fx.channel[i],
        index: i,
        songRepeat,
        trackEffects: fx.track,
        tracks: trackAtm
      })
    };
  });
  
  // sort the non-channel patterns by index returned as an ordered array
  const orderedPatterns = orderBy(trackAtm, ['index']);
  const allPatterns = [...channelTracks, ...orderedPatterns];

  // construct the audio file text
  // DEV NOTE: keep the awkward indentation below to preserve the final shape
  // expected in the output
  const completeSong = `${getHeaderDefinitions(normalizedSongName.toUpperCase())}
  
${getPatternDefinitions(allPatterns, normalizedSongName)}
${getScoreData(allPatterns, normalizedSongName)}

#endif`;

  return completeSong;
}

/**
 * audio file boilerplate members defined
 * @param {String} songName The song name to apply to the header definitions
 * @return {String} The template string with the song name applied
 */
function getHeaderDefinitions (songName = 'SONG') {
  return `#ifndef ${songName}_H
#define ${songName}_H
  
#include "atm_cmd_constants.h"
  
#ifndef ARRAY_SIZE
#define ARRAY_SIZE(a) (sizeof (a) / sizeof ((a)[0]))
#endif
  
#ifndef NUM_PATTERNS
#define NUM_PATTERNS(struct_) (ARRAY_SIZE( ((struct_ *)0)->patterns_offset))
#endif
  
#ifndef DEFINE_PATTERN
#define DEFINE_PATTERN(pattern_id, values) const uint8_t pattern_id[] = values;
#endif`;
  }

/**
 * Returns the note string correlating to the scale described here:
 * https://github.com/moduscreate/ATMlib/blob/ATMLib2/src/atm_cmd_constants.h#L3
 * 
 * i.e. 1 will return C2
 *      2 will return C2_
 *      etc.
 * @param {Number} note The note index to correlate to the full notes scale
 * @return {String} The note string expected to be appended to the end of the
 * ATM_CMD_I_NOTE_ command
 */
function getNote (note) {
  if (note === 0) {
    return 'OFF';
  }

  // the octave level for the passed index *starting at 2*
  const level = Math.ceil(note / 12) + 1;
  // the note on the chromatic scale
  const notePos = note % 12;
  const { letter, suffix = '' } = noteVal[notePos];

  return `${letter}${level}${suffix}`;
}

/**
 * Returns a string used in the audio files for all of the pattern info for both
 * channel and non-channel patterns.
 * @param {Array} allPatterns An array of all patterns in the order they're to
 * be processed in playback
 * @param {String} songName The song name to apply to the template string
 * @return {String} The pattern info for the output audio file
 */
function getScoreData (allPatterns, songName) {
  // filter out just the channel-type patterns from the full array
  const channels = allPatterns.filter(pattern => pattern.type === 'channel');
  const channelCount = channels.length;

  // return the string used for the size of each pattern variable
  const sizeData = allPatterns.map((pattern, i) => {
    return `uint8_t ${songName}_pattern${i}[sizeof(${songName}_pattern${i}_array)];`
  }).join('\n  ');

  // return the string of all pattern offsets
  const patternOffsets = allPatterns.map((pattern, i) => {
    return `offsetof(struct ${songName}_score_data, ${songName}_pattern${i}),`
  }).join('\n      ');
  
  // return the string for all pattern data mappings
  const patternData = allPatterns.map((pattern, i) => {
    return `.${songName}_pattern${i} = ${songName}_pattern${i}_data,`
  }).join('\n  ');

  // DEV NOTE: keep the awkward indentation below to preserve the final shape
  // expected in the output
  return `const PROGMEM struct ${songName}_score_data {
  uint8_t fmt;
  uint8_t num_patterns;
  uint16_t patterns_offset[${allPatterns.length}];
  uint8_t num_channels;
  uint8_t start_patterns[${channelCount}];
  ${sizeData}
} ${songName} = {
  .fmt = ATM_SCORE_FMT_FULL,
  .num_patterns = NUM_PATTERNS(struct ${songName}_score_data),
  .patterns_offset = {
      ${patternOffsets}
  },
  .num_channels = ${channelCount},
  .start_patterns = {
    0x00,                         // Channel 0 entry track (SQUARE)
    0x01,                         // Channel 1 entry track (SQUARE)
    0x02,                         // Channel 2 entry track (SQUARE)
    0x03,                         // Channel 3 entry track (NOISE)
  },
  ${patternData}
};`;
}

/**
 * Return all of the pattern definitions using the `notes` info from all
 * patterns
 * @param {Array} allPatterns An array of all patterns in the order they're to
 * be processed in playback
 * @param {String} songName The song name to apply to the template string
 * @return {String} The string of pattern definitions for the pre-compiled audio
 * file
 */
function getPatternDefinitions (allPatterns, songName) {
  let patterns = [];

  // loop over all of the patterns to add their individual definitions to the
  // `patterns` array to be joined in the final return statement
  allPatterns.forEach((pattern, i) => {
    const { typeText, name = '' } = pattern;
    const { notes, bytes } = pattern.atm;
    const nameText = name.length ? ` / "${name}"` : '';
    
    // DEV NOTE: keep the awkward indentation below to preserve the final shape
    // expected in the output
    let string = `/* ${typeText}${nameText} / bytes = ${bytes}*/
#define ${songName}_pattern${i}_data { \\
    ${notes.join(', \\\n    ')}, \\
}
DEFINE_PATTERN(${songName}_pattern${i}_array, ${songName}_pattern${i}_data);
    `;

    patterns.push(string);
  });

  return patterns.join('\n');
}

/**
 * Returns the correlating effects commands / values for the passed in effects
 * using the passed in type
 * @param {*} effects 
 * @param {*} type 
 */
function getFxList (effects, type) {
  const active = [];
  const { flags: activeFx } = effects;

  const startFxList = Object.keys(startFx);
  const lastFxList = Object.keys(endFx);
  const activeList = (type === 'first') ? startFxList : lastFxList;

  // loop over the active list to identify matching effects
  activeList.forEach((code, i) => {
    if (activeList[i] & activeFx) {
      active.push(activeList[i]);
    }
  });

  return active;
}

/**
 * Create an object with an array of effects used by a given pattern
 * @param {Number[]} fxToAdd Array of effects (their keys) to add
 * @param {String} type The type of effects being added: 'start' or 'last'
 * @param {Object} effects The effects object for a given pattern (as it would
 * appear in the tracker file)
 * @return {Object} An object with the bytes for the effects and an 'fx' key 
 * with an array of effect commands correlating to the effects keys passed in
 */
function createFxArray (fxToAdd, type, effects) {
  const result = {
    fx: [],
    bytes: 0
  }

  const fxList = (type === 'start') ? startFx : endFx;

  let fxInfo,
      fxData;

  // loop over the array of effects-by-id to add
  for ( let i = 0, l = fxToAdd.length; i < l; i++ ) {
    // get the effects commands / values using the effect id
    const effect = fxToAdd[i];
    fxInfo = fxList[effect];
    // get the effects data by id
    fxData = effects.fx[effect] || {};

    // the param values for each effect (defaulting to 0)
    const { val_0 = 0, val_1 = 0, val_2 = 0, val_3 = 0, val_4 = 0 } = fxData;
    const params = [];
    const { values, cmd } = fxInfo;

    // add the params to the params list (one or two params depending on the
    // effect) to be added to the effect command
    if ( values < 5 && values > 0 )
      params.push(val_0);
    if ( values > 1 && values < 5 )
      params.push(val_1);
    if ( values === 5 ) { // then it's arpeggio
      const param1 = parseInt(val_2.toString(16) + val_3.toString(16), 16);
      const param2 = (val_0 ? 64 : 0) + (val_1 ? 32 : 0) + val_4;
      params.push(param1, param2);
    }
    
    // create the params string to be placed in the effect call parenthesis
    const paramsList = params.join(', ');
    // add the effect command + params to the fx array
    result.fx.push(fxInfo.cmd.replace('${paramsList}', paramsList));

    // tally up the bytes for the command
    if ( values !== 5 )
      result.bytes += fxInfo.values + 1;
    else
      result.bytes += 3;
  }

  return result;
}

/**
 * Aggregate all effects and GOTO and REPEAT commands for the passed channel
 * @param {Object} channel The channel to populate
 * @param {Object} channel.tracks All tracks for the channel keyed by an
 * internal index
 * @param {Array} channel.channel Track data for all tracks represented in
 * `channel.tracks`
 * @param {Number} channel.index The channel index
 * @param {Object} channel.effects Effects to apply to the channel
 * @param {Object} channel.effects Effects to apply to the tracks on this
 * channel
 * @return {Object} An object with the channel byte count and the channel 
 * commands including effects as well as GOTO and REPEAT commands
 */
function atmifyChannel ({ channel, effects, index, 
                          songRepeat, trackEffects, tracks}) {
  let channelTrack = [];
  let totalBytes = 0;

  // create the array of starting effects
  const newFxStart = createFxArray(
    getFxList(effects, 'first'),
    'start',
    effects
  );
  
  // add the effects commands to the channel commands list
  channelTrack = channelTrack.concat(newFxStart.fx);
  totalBytes += newFxStart.bytes;

  let previousTrackId = -1,
      previousTrackEffects = 0,
      count = 0;

  // loop over all tracks and include references to them in the channel commands
  for ( const track of channel ) {
    const eff = trackEffects[track.editorId] || {flags:0};

    if ( previousTrackId === track.id && !eff.flags && !previousTrackEffects ) {
      count++;
      channelTrack.pop();
      channelTrack.push(
        `ATM_CMD_M_CALL_REPEAT(${tracks[track.id].index + 4}, ${count + 1})`
      );
      if (count === 1)
        // we remove a line with 2 bytes (GOTO = 2 bytes) and we add
        // 3 bytes (REPEAT = 3 bytes)
        totalBytes++;
    } else {
      let startFx,
          endFx;

      if (eff.flags) {
        startFx = createFxArray(getFxList(eff, 'first'), 'start', eff);
        endFx = createFxArray(getFxList(eff, 'last'), 'end', eff);
      }

      // add first track fx before track
      if (startFx) {
        channelTrack = channelTrack.concat(startFx.fx);
        totalBytes += startFx.bytes;
      }

      count = 0;
      // goto track
      channelTrack.push(`ATM_CMD_M_CALL(${tracks[track.id].index + 4})`);
      totalBytes += 2;

      // add last track fx after track
      if (endFx) {
        channelTrack = channelTrack.concat(endFx.fx);
        totalBytes += endFx.bytes;
      }

      previousTrackId = track.id;
      previousTrackEffects = eff.flags;
    }
  }

  // add ending fx after channel commands
  const newFxEnd = createFxArray(getFxList(effects, 'last'), 'end', effects);
  channelTrack = channelTrack.concat(newFxEnd.fx);
  totalBytes += newFxEnd.bytes;

  // end of channel
  if (songRepeat && channelTrack.length) {
    channelTrack.push(`ATM_CMD_M_SET_LOOP_PATTERN(${index})`);
  }
  channelTrack.push('ATM_CMD_I_STOP');
  totalBytes++;

  return {
    notes: channelTrack,
    bytes: totalBytes
  };
}

/**
 * Aggregate all effects and note commands for the passed channel
 * @param {Object} requiredDrumTracks An object with percussion channel types as
 * the keys (only if present in the current song)
 * @param {Object} track The current "tune" track to assemble
 * @return {Object} An object the total bytes and the assembled pattern commands
 */
function atmifyTrack (requiredDrumTracks, track) {
  if ( track.type === 'tune' )
    return atmifyRegularTrack(track);
  else
    return atmifyDrumTrack(requiredDrumTracks, track);
}

/**
 * Aggregate all effects and note commands for the passed non-drum pattern
 * @param {Object} track The pattern object including the note information as
 * it's created for the tracker file
 * @return {Object} An object the total bytes and the assembled pattern commands
 */
function atmifyRegularTrack (track) {
  const { notes } = track;
  const noteSequence = [];

  let thisNote,
    lastNote = -1,
    thisNoteNumber,
    lastDelayTotal,
    totalBytes = 0;

  // loop over the notes and add the note / delay commands for the pattern
  notes.forEach(({ active: thisNote }) => {
    thisNoteNumber = ~thisNote ? thisNote : 0;

    if ( thisNote === lastNote ) {
      if ( !noteSequence.length ) {
        noteSequence[0] = `ATM_CMD_I_NOTE_${getNote(thisNoteNumber)}`;
        noteSequence[1] = `ATM_CMD_M_DELAY_TICKS(1)`;
        lastDelayTotal = 1;
        totalBytes = 2;
      } else {
        const lastDelay = noteSequence[noteSequence.length - 1];
        lastDelayTotal++;
        const delayString = `ATM_CMD_M_DELAY_TICKS(${lastDelayTotal})`;
        noteSequence[noteSequence.length - 1] = delayString;
      }
    } else {
      // note to play
      noteSequence.push(`ATM_CMD_I_NOTE_${getNote(thisNoteNumber)}`);
      // play for 1 tick
      noteSequence.push(`ATM_CMD_M_DELAY_TICKS(1)`);
      lastDelayTotal = 1;
      totalBytes += 2;
    }
    lastNote = thisNote;
  });

  noteSequence.push('ATM_CMD_I_RETURN');
  totalBytes++;

  return {
    notes: noteSequence,
    bytes: totalBytes
  };
}

/**
 * Aggregate all effects and note commands for the passed drum pattern
 * @param {*} drumTrackNumbers An object with percussion channel types as
 * the keys
 * @param {*} track The current "tune" track to assemble
 * @return {Object} An object the total bytes and the assembled pattern commands
 */
function atmifyDrumTrack (drumTrackNumbers, track) {
  const { notes } = track;

  let note,
    noteSequence = [],
    wasEmpty = false,
    skip = 0,
    lastDelayTotal,
    totalBytes = 0;

  // loop over the notes and add the ticks / delay commands for the pattern
  for ( let x = 0, l = track.ticks; x < l; x++ ) {
    note = notes[x];
    if ( (note === undefined || note === null) && skip-- < 1 ) {
      if (wasEmpty) {
        lastDelayTotal++;
        const delayString = `ATM_CMD_M_DELAY_TICKS(${lastDelayTotal})`;
        noteSequence[noteSequence.length - 1] = delayString;
      } else {
        wasEmpty = true;
        noteSequence.push(`ATM_CMD_M_DELAY_TICKS(1)`);
        lastDelayTotal = 1;
        totalBytes += 1;
      }
    } else if ( note !== undefined && Object.prototype.toString.apply(note).slice(8, -1) === 'String' ) {
      skip = getEffectLength(note);
      wasEmpty = false;
      const target = drumTrackNumbers[note] + 4;
      noteSequence.push(`ATM_CMD_M_CALL(${target})`);
      totalBytes += 2;
    }
  };

  // end of track (RETURN)
  noteSequence.push('ATM_CMD_I_RETURN');
  totalBytes++;

  return {
    notes: noteSequence,
    bytes: totalBytes
  };
}

/**
 * Extract the drum track types from all tracks
 * @param {Array} tracks Array of all tracks in the song
 * @return {Object} An object with keys of all drum track types for this song
 */
function getRequiredDrumTracks (tracks) {
  let track,
      notes;
  const required = {};

  const drumTracks = tracks.filter(track => track.type === 'drum');
  drumTracks.forEach(({ notes = [] }) => {
    notes.forEach(note => {
      if (note) {
        required[note] = true;
      }
    });
  });

  Object.keys(required).forEach((name, i) => required[name] = i);
  
  return required;
}
