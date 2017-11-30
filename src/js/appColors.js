import color from 'color'
import colormap from 'colormap'

const colors = colormap({
      colormap: 'rainbow',
      nshades: 16,
      format: 'hex',
      alpha: 1
})
const colorsArr = colors.map(hex => color(hex))
const colorsHex = colorsArr.map(colorObj => colorObj.hex())
const colorsObj = {}

colorsArr.forEach((colorObj, i) => {
    const [ r, g, b ] = colorObj.rgb().array()

    colorsObj[i] = {
        hex: colorObj.hex(),
        rgb: { r, g, b }
    }
})

export { colorsObj, colorsHex }