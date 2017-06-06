export default function createNewTrack (type, tracks) {
    const ticks = 8
    const myId = getNewId(tracks)
    const newTrackData = {
        ticks,
        color: getNewTrackColor(myId),
        id: myId,
        name: `Track ${myId + 1}`,
        type,
        notes: []
    }
    if ( type === 'tune' )
        for ( let x = 0; x < ticks; x++ ) {
            newTrackData.notes.push({active: -1})
        }

    return newTrackData
}

function getNewTrackColor (id) {
    switch (( parseInt(id)||0 ) % 16) {
        case 0: return { hex: '#ff7e00', rgb: {r: 255, g: 126, b: 0} }
        case 1: return { hex: '#ff69a8', rgb: {r: 255, g: 105, b: 168} }
        case 2: return { hex: '#00a8cc', rgb: {r: 0, g: 168, b: 204} }
        case 3: return { hex: '#00d2ae', rgb: {r: 0, g: 210, b: 174} }
        case 4: return { hex: '#584d4d', rgb: {r: 88, g: 77, b: 77} }
        case 5: return { hex: '#7171d8', rgb: {r: 113, g: 113, b: 216} }
        case 6: return { hex: '#df2020', rgb: {r: 223, g: 32, b: 32} }
        case 7: return { hex: '#24eb24', rgb: {r: 36, g: 235, b: 36} }
        case 8: return { hex: '#ffcc99', rgb: {r: 255, g: 204, b: 153} }
        case 9: return { hex: '#ffbdd8', rgb: {r: 255, g: 189, b: 216} }
        case 10: return { hex: '#85e9ff', rgb: {r: 133, g: 233, b: 255} }
        case 11: return { hex: '#75ffe8', rgb: {r: 117, g: 255, b: 232} }
        case 12: return { hex: '#aea2a2', rgb: {r: 174, g: 162, b: 162} }
        case 13: return { hex: '#b7b7eb', rgb: {r: 183, g: 183, b: 235} }
        case 14: return { hex: '#ef8f8f', rgb: {r: 239, g: 143, b: 143} }
        case 15: return { hex: '#98f598', rgb: {r: 152, g: 245, b: 152} }
        default: return { hex: '#ff7e00', rgb: {r: 255, g: 126, b: 0} }
    }
}

function getNewId (tracks) {
    let counter = 0

    for ( let i = 0, l = tracks.length; i < l; i++ ) {
        if ( counter <= tracks[i].id )
            counter = tracks[i].id + 1
    }

    return counter
}
