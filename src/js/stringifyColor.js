function stringifyColor (color, type, custom) {
    if ( type === 'hex' ) return color.hex

    let selectedColor,
        result
    if ( type.length === 4 ) {
        selectedColor = Object.assign({}, color[type.slice(0, 3)], custom)
        result = `${type}(${selectedColor[type[0]]}, ${selectedColor[type[1]]}, ${selectedColor[type[2]]}, ${selectedColor[type[3]]})`
    } else {
        selectedColor = Object.assign({}, color[type], custom)
        result = `${type}(${selectedColor[type[0]]}, ${selectedColor[type[1]]}, ${selectedColor[type[2]]})`
    }

    return result
}

export default stringifyColor
